/**
 * ESPN Fantasy Routes
 * Handles ESPN Fantasy Sports integration via the ESPN Bridge service
 */

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const logger = require('../../utils/logger');

// Import ESPN services
const ESPNBridgeClient = require('../../services/platforms/espn/espn-bridge');
const bridgeClient = new ESPNBridgeClient({
  baseUrl: process.env.ESPN_BRIDGE_URL || 'http://localhost:3001'
});

/**
 * @route   POST /api/v1/espn/connect
 * @desc    Connect ESPN Fantasy account using cookies
 * @body    { league_id, espn_s2, swid, sport }
 */
router.post('/connect', async (req, res, next) => {
  try {
    const { league_id, espn_s2, swid, sport = 'football' } = req.body;
    
    // Validate required fields
    if (!league_id || !espn_s2 || !swid) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: league_id, espn_s2, swid'
      });
    }
    
    logger.info(`Connecting ESPN account for league ${league_id}`);
    
    // Authenticate with ESPN Bridge
    const leagueData = await bridgeClient.authenticate({
      leagueId: league_id,
      espnS2: espn_s2,
      swid: swid,
      sport: sport
    });
    
    // Store encrypted cookies in session (implement your session storage)
    req.session = req.session || {};
    req.session.espn = {
      connected: true,
      connectedAt: new Date().toISOString(),
      // In production, encrypt these values
      espn_s2: espn_s2,
      swid: swid,
      sport: sport,
      leagues: [league_id]
    };
    
    res.json({
      success: true,
      message: 'ESPN account connected successfully',
      league: {
        id: leagueData.id,
        name: leagueData.name,
        sport: leagueData.sport,
        season: leagueData.season,
        totalTeams: leagueData.totalTeams
      }
    });
    
  } catch (error) {
    logger.error('ESPN connection error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to connect ESPN account'
    });
  }
});

/**
 * @route   GET /api/v1/espn/leagues
 * @desc    Get all connected ESPN leagues
 */
router.get('/leagues', async (req, res, next) => {
  try {
    // Check if ESPN is connected
    if (!req.session?.espn?.connected) {
      return res.status(401).json({
        success: false,
        error: 'ESPN not connected. Please connect your account first.'
      });
    }
    
    const { espn_s2, swid, leagues, sport } = req.session.espn;
    
    // Fetch multiple leagues
    const result = await bridgeClient.fetchMultipleLeagues({
      leagueIds: leagues,
      espnS2: espn_s2,
      swid: swid,
      sport: sport
    });
    
    res.json({
      success: true,
      leagues: result.leagues,
      total: result.successful_leagues
    });
    
  } catch (error) {
    logger.error('Failed to fetch ESPN leagues:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch leagues'
    });
  }
});

/**
 * @route   GET /api/v1/espn/league/:leagueId
 * @desc    Get specific league data
 */
router.get('/league/:leagueId', async (req, res, next) => {
  try {
    const { leagueId } = req.params;
    
    // Check if ESPN is connected
    if (!req.session?.espn?.connected) {
      return res.status(401).json({
        success: false,
        error: 'ESPN not connected'
      });
    }
    
    const { espn_s2, swid, sport } = req.session.espn;
    
    logger.info(`Fetching ESPN league ${leagueId}`);
    
    const leagueData = await bridgeClient.authenticate({
      leagueId: leagueId,
      espnS2: espn_s2,
      swid: swid,
      sport: sport
    });
    
    res.json({
      success: true,
      league: leagueData
    });
    
  } catch (error) {
    logger.error(`Failed to fetch league ${req.params.leagueId}:`, error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch league data'
    });
  }
});

/**
 * @route   GET /api/v1/espn/league/:leagueId/roster/:teamId
 * @desc    Get team roster details
 */
router.get('/league/:leagueId/roster/:teamId', async (req, res, next) => {
  try {
    const { leagueId, teamId } = req.params;
    
    if (!req.session?.espn?.connected) {
      return res.status(401).json({
        success: false,
        error: 'ESPN not connected'
      });
    }
    
    const { espn_s2, swid, sport } = req.session.espn;
    
    const rosterData = await bridgeClient.getTeamRoster({
      leagueId,
      teamId,
      espnS2: espn_s2,
      swid: swid,
      sport: sport
    });
    
    res.json({
      success: true,
      team: rosterData.team,
      roster: rosterData.roster
    });
    
  } catch (error) {
    logger.error(`Failed to fetch roster for team ${req.params.teamId}:`, error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch roster'
    });
  }
});

/**
 * @route   POST /api/v1/espn/disconnect
 * @desc    Disconnect ESPN account
 */
router.post('/disconnect', (req, res) => {
  try {
    // Clear ESPN session
    if (req.session?.espn) {
      delete req.session.espn;
    }
    
    logger.info('ESPN account disconnected');
    
    res.json({
      success: true,
      message: 'ESPN account disconnected successfully'
    });
    
  } catch (error) {
    logger.error('Failed to disconnect ESPN:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to disconnect ESPN account'
    });
  }
});

/**
 * @route   GET /api/v1/espn/status
 * @desc    Check ESPN connection status
 */
router.get('/status', async (req, res) => {
  try {
    const connected = req.session?.espn?.connected || false;
    
    if (!connected) {
      return res.json({
        success: true,
        connected: false,
        message: 'ESPN not connected'
      });
    }
    
    // Check if bridge service is available
    const healthCheck = await bridgeClient.healthCheck();
    
    res.json({
      success: true,
      connected: true,
      connectedAt: req.session.espn.connectedAt,
      leagues: req.session.espn.leagues?.length || 0,
      bridgeStatus: healthCheck.status
    });
    
  } catch (error) {
    logger.error('ESPN status check failed:', error);
    res.json({
      success: true,
      connected: false,
      error: 'Bridge service unavailable'
    });
  }
});

/**
 * @route   POST /api/v1/espn/refresh
 * @desc    Refresh ESPN data for all connected leagues
 */
router.post('/refresh', async (req, res) => {
  try {
    if (!req.session?.espn?.connected) {
      return res.status(401).json({
        success: false,
        error: 'ESPN not connected'
      });
    }
    
    const { espn_s2, swid, leagues, sport } = req.session.espn;
    
    logger.info('Refreshing ESPN league data');
    
    // Fetch fresh data for all leagues
    const result = await bridgeClient.fetchMultipleLeagues({
      leagueIds: leagues,
      espnS2: espn_s2,
      swid: swid,
      sport: sport
    });
    
    res.json({
      success: true,
      message: 'ESPN data refreshed successfully',
      leagues_updated: result.successful_leagues,
      errors: result.errors
    });
    
  } catch (error) {
    logger.error('ESPN refresh failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to refresh ESPN data'
    });
  }
});

module.exports = router;