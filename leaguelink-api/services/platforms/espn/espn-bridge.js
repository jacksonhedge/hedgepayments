/**
 * ESPN Bridge Service Client
 * Communicates with the Python ESPN Bridge microservice
 */

const axios = require('axios');
const logger = require('../../../utils/logger');

class ESPNBridgeClient {
  constructor(config = {}) {
    this.baseUrl = config.baseUrl || process.env.ESPN_BRIDGE_URL || 'http://localhost:3001';
    this.timeout = config.timeout || 30000;
    
    // Create axios instance with defaults
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add request/response interceptors for logging
    this.client.interceptors.request.use(
      (config) => {
        logger.debug(`ESPN Bridge Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('ESPN Bridge Request Error:', error);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        logger.debug(`ESPN Bridge Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        logger.error('ESPN Bridge Response Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Check health of ESPN Bridge service
   */
  async healthCheck() {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error) {
      logger.error('ESPN Bridge health check failed:', error);
      throw new Error('ESPN Bridge service is unavailable');
    }
  }

  /**
   * Authenticate and fetch league data using ESPN session cookies
   * @param {Object} credentials - ESPN session credentials
   * @param {string} credentials.leagueId - ESPN league ID
   * @param {string} credentials.espnS2 - ESPN S2 session cookie
   * @param {string} credentials.swid - ESPN SWID cookie
   * @param {string} credentials.sport - Sport type (football/basketball)
   */
  async authenticate(credentials) {
    try {
      const { leagueId, espnS2, swid, sport = 'football' } = credentials;

      if (!leagueId || !espnS2 || !swid) {
        throw new Error('Missing required ESPN credentials');
      }

      const response = await this.client.post('/authenticate', {
        league_id: leagueId,
        espn_s2: espnS2,
        swid: swid,
        sport: sport
      });

      if (response.data.success) {
        return this.normalizeLeagueData(response.data.league_data);
      } else {
        throw new Error(response.data.error || 'Authentication failed');
      }
    } catch (error) {
      logger.error('ESPN authentication failed:', error);
      throw error;
    }
  }

  /**
   * Fetch multiple leagues at once
   * @param {Object} params - Parameters for fetching multiple leagues
   * @param {Array<string>} params.leagueIds - Array of league IDs
   * @param {string} params.espnS2 - ESPN S2 session cookie
   * @param {string} params.swid - ESPN SWID cookie
   * @param {string} params.sport - Sport type
   */
  async fetchMultipleLeagues(params) {
    try {
      const { leagueIds, espnS2, swid, sport = 'football' } = params;

      if (!leagueIds || !Array.isArray(leagueIds) || leagueIds.length === 0) {
        throw new Error('League IDs must be a non-empty array');
      }

      const response = await this.client.post('/leagues/multiple', {
        league_ids: leagueIds,
        espn_s2: espnS2,
        swid: swid,
        sport: sport
      });

      if (response.data.success) {
        return {
          ...response.data,
          leagues: response.data.leagues.map(league => this.normalizeLeagueData(league))
        };
      } else {
        throw new Error('Failed to fetch multiple leagues');
      }
    } catch (error) {
      logger.error('Failed to fetch multiple leagues:', error);
      throw error;
    }
  }

  /**
   * Get detailed roster for a specific team
   * @param {Object} params - Parameters for fetching team roster
   * @param {string} params.leagueId - League ID
   * @param {string} params.teamId - Team ID
   * @param {string} params.espnS2 - ESPN S2 session cookie
   * @param {string} params.swid - ESPN SWID cookie
   * @param {string} params.sport - Sport type
   */
  async getTeamRoster(params) {
    try {
      const { leagueId, teamId, espnS2, swid, sport = 'football' } = params;

      const response = await this.client.post(`/league/${leagueId}/roster/${teamId}`, {
        espn_s2: espnS2,
        swid: swid,
        sport: sport
      });

      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch team roster');
      }
    } catch (error) {
      logger.error('Failed to fetch team roster:', error);
      throw error;
    }
  }

  /**
   * Normalize league data to LeagueLink standard format
   * @param {Object} leagueData - Raw league data from ESPN Bridge
   */
  normalizeLeagueData(leagueData) {
    return {
      // League identification
      id: `espn_${leagueData.league_id}`,
      platform: 'espn',
      externalId: leagueData.league_id,
      
      // Basic info
      name: leagueData.name,
      sport: leagueData.sport,
      season: leagueData.season,
      
      // League details
      totalTeams: leagueData.total_teams,
      currentWeek: leagueData.current_week,
      
      // Settings
      settings: {
        ...leagueData.settings,
        scoringType: leagueData.settings.scoring_type,
        playoffTeams: leagueData.settings.playoff_team_count,
        playoffWeekStart: leagueData.settings.playoff_week_start,
        tradeDeadline: leagueData.settings.trade_deadline,
        waiverType: leagueData.settings.waiver_type,
        faabBudget: leagueData.settings.faab_budget
      },
      
      // Teams
      teams: leagueData.teams.map(team => this.normalizeTeamData(team)),
      
      // Standings
      standings: leagueData.standings,
      
      // Current matchups
      scoreboard: leagueData.scoreboard,
      
      // Recent activity
      recentActivity: leagueData.recent_activity,
      
      // Metadata
      lastUpdated: new Date().toISOString(),
      raw: leagueData // Keep original data for reference
    };
  }

  /**
   * Normalize team data to standard format
   * @param {Object} teamData - Raw team data from ESPN
   */
  normalizeTeamData(teamData) {
    return {
      id: `espn_team_${teamData.team_id}`,
      externalId: teamData.team_id,
      name: teamData.team_name,
      abbreviation: teamData.team_abbrev,
      owner: teamData.owner,
      
      // Record
      record: {
        wins: teamData.wins,
        losses: teamData.losses,
        ties: teamData.ties,
        winPercentage: teamData.wins / (teamData.wins + teamData.losses + teamData.ties)
      },
      
      // Stats
      stats: {
        pointsFor: teamData.points_for,
        pointsAgainst: teamData.points_against,
        standing: teamData.standing,
        playoffPercentage: teamData.playoff_pct
      },
      
      // Roster
      roster: teamData.roster.map(player => this.normalizePlayerData(player)),
      
      // Visual
      logoUrl: teamData.logo_url
    };
  }

  /**
   * Normalize player data to standard format
   * @param {Object} playerData - Raw player data from ESPN
   */
  normalizePlayerData(playerData) {
    return {
      id: `espn_player_${playerData.player_id}`,
      externalId: playerData.player_id,
      name: playerData.name,
      position: playerData.position,
      team: playerData.team,
      
      // Status
      status: {
        injury: playerData.injury_status,
        slot: playerData.slot_position
      },
      
      // Stats
      stats: {
        projectedPoints: playerData.projected_points,
        totalPoints: playerData.total_points,
        averagePoints: playerData.avg_points
      },
      
      // Ownership
      ownership: {
        percentOwned: playerData.percent_owned,
        percentStarted: playerData.percent_started,
        acquisitionType: playerData.acquisition_type
      },
      
      // Eligibility
      eligibleSlots: playerData.eligibile_slots || []
    };
  }
}

module.exports = ESPNBridgeClient;