/**
 * ESPN Data Normalizer
 * Converts raw ESPN API responses into LeagueLink standard format
 * Handles all the quirks and inconsistencies of ESPN's data structure
 */

const logger = require('../../utils/logger');

class ESPNDataNormalizer {
  constructor() {
    // ESPN position ID mappings
    this.positionMap = {
      0: 'QB',
      1: 'QB', 
      2: 'RB', 
      3: 'WR',
      4: 'TE',
      5: 'K',
      16: 'D/ST',
      17: 'FLEX',
      20: 'BENCH',
      21: 'IR',
      23: 'FLEX'
    };

    // ESPN lineup slot mappings
    this.lineupSlotMap = {
      0: 'QB',
      2: 'RB',
      4: 'WR', 
      6: 'TE',
      16: 'D/ST',
      17: 'K',
      20: 'BENCH',
      21: 'IR',
      23: 'FLEX'
    };

    // ESPN team ID to abbreviation mapping (NFL teams)
    this.nflTeamMap = {
      1: 'ATL', 2: 'BUF', 3: 'CHI', 4: 'CIN', 5: 'CLE', 6: 'DAL', 7: 'DEN', 8: 'DET',
      9: 'GB', 10: 'TEN', 11: 'IND', 12: 'KC', 13: 'LV', 14: 'LAR', 15: 'MIA', 16: 'MIN',
      17: 'NE', 18: 'NO', 19: 'NYG', 20: 'NYJ', 21: 'PHI', 22: 'ARI', 23: 'PIT', 24: 'LAC',
      25: 'SF', 26: 'SEA', 27: 'TB', 28: 'WAS', 29: 'CAR', 30: 'JAX', 33: 'BAL', 34: 'HOU'
    };

    // ESPN acquisition type mappings
    this.acquisitionTypeMap = {
      0: 'DRAFT',
      1: 'ADD',
      2: 'TRADE'
    };
  }

  /**
   * Main normalization function for league data
   * @param {Object} rawResponse - Raw ESPN API response
   * @param {string} sport - Sport type (football/basketball)
   */
  normalizeLeagueData(rawResponse, sport = 'football') {
    try {
      if (!rawResponse.success) {
        return this.normalizeError(rawResponse);
      }

      const league = rawResponse.data;
      
      if (!league) {
        return this.normalizeError({
          error: 'NO_DATA',
          message: 'No league data in ESPN response'
        });
      }

      logger.debug(`Normalizing ESPN league data for league ${league.id}`);

      const normalized = {
        // Core identifiers
        league_id: league.id?.toString() || 'unknown',
        platform: 'espn',
        sport: sport,
        
        // Basic league info
        name: league.settings?.name || `ESPN ${sport} League`,
        season: league.seasonId || new Date().getFullYear(),
        status: league.status || 'active',
        current_week: league.scoringPeriodId || 1,
        
        // League structure
        total_teams: league.teams?.length || 0,
        total_weeks: league.settings?.scheduleSettings?.matchupPeriodCount || 17,
        playoff_teams: league.settings?.scheduleSettings?.playoffTeamCount || 6,
        
        // Settings and configuration
        settings: this.normalizeSettings(league.settings),
        
        // Teams and rosters
        teams: this.normalizeTeams(league.teams || []),
        
        // Current standings
        standings: this.generateStandings(league.teams || []),
        
        // Current week scoreboard
        scoreboard: this.normalizeScoreboard(league.schedule),
        
        // Recent activity
        recent_activity: this.normalizeActivity(league.recentActivity),
        
        // Draft information
        draft_info: this.normalizeDraftInfo(league.draftDetail),
        
        // Metadata
        last_updated: new Date().toISOString(),
        api_version: 'v3',
        cached: rawResponse.cached || false
      };

      // Add member count
      normalized.members = normalized.total_teams;

      return {
        success: true,
        data: normalized
      };

    } catch (error) {
      logger.error('Error normalizing ESPN league data:', error);
      return this.normalizeError({
        error: 'NORMALIZATION_ERROR',
        message: error.message
      });
    }
  }

  /**
   * Normalize league settings
   */
  normalizeSettings(settings) {
    if (!settings) return {};

    try {
      return {
        name: settings.name || 'ESPN League',
        league_type: 'H2H_POINTS', // Most common ESPN format
        scoring_type: this.getScoringType(settings.scoringSettings),
        roster_settings: this.normalizeRosterSettings(settings.rosterSettings),
        schedule_settings: this.normalizeScheduleSettings(settings.scheduleSettings),
        acquisition_settings: this.normalizeAcquisitionSettings(settings.acquisitionSettings),
        trade_settings: this.normalizeTradeSettings(settings.tradeSettings),
        keeper_count: settings.keeperCount || 0,
        draft_type: settings.draftSettings?.type === 'AUCTION' ? 'auction' : 'snake',
        playoff_week_start: settings.scheduleSettings?.playoffSeedingRule || 14,
        regular_season_matchup_periods: settings.scheduleSettings?.regularSeasonMatchupPeriodCount || 14
      };
    } catch (error) {
      logger.error('Error normalizing settings:', error);
      return {};
    }
  }

  /**
   * Determine scoring type from settings
   */
  getScoringType(scoringSettings) {
    if (!scoringSettings) return 'standard';
    
    // Check for PPR settings
    const receivingStats = scoringSettings.scoringItems || {};
    const pprValue = receivingStats['53'] || 0; // Receptions stat ID
    
    if (pprValue >= 1) return 'ppr';
    if (pprValue > 0 && pprValue < 1) return 'half_ppr';
    return 'standard';
  }

  /**
   * Normalize roster settings
   */
  normalizeRosterSettings(rosterSettings) {
    if (!rosterSettings) return {};

    return {
      starting_roster_size: this.calculateStartingRosterSize(rosterSettings.lineupSlotCounts),
      lineup_slots: rosterSettings.lineupSlotCounts || {},
      bench_slots: rosterSettings.benchSlots || 0,
      ir_slots: rosterSettings.injuredReserveSlots || 0,
      total_roster_size: (rosterSettings.rosterSlotCounts?.reduce((a, b) => a + b, 0)) || 0
    };
  }

  /**
   * Calculate starting roster size from lineup slots
   */
  calculateStartingRosterSize(lineupSlotCounts) {
    if (!lineupSlotCounts) return 0;
    
    return Object.entries(lineupSlotCounts)
      .filter(([slot]) => parseInt(slot) !== 20) // Exclude bench
      .reduce((total, [, count]) => total + count, 0);
  }

  /**
   * Normalize schedule settings
   */
  normalizeScheduleSettings(scheduleSettings) {
    if (!scheduleSettings) return {};

    return {
      matchup_period_count: scheduleSettings.matchupPeriodCount || 17,
      playoff_team_count: scheduleSettings.playoffTeamCount || 6,
      playoff_matchup_period_count: scheduleSettings.playoffMatchupPeriodCount || 3,
      regular_season_matchup_period_count: scheduleSettings.regularSeasonMatchupPeriodCount || 14
    };
  }

  /**
   * Normalize acquisition settings (waivers, free agents)
   */
  normalizeAcquisitionSettings(acquisitionSettings) {
    if (!acquisitionSettings) return {};

    return {
      waiver_type: acquisitionSettings.waiverType || 'STANDARD',
      waiver_order_type: acquisitionSettings.waiverOrderType || 'MOVE_TO_LAST',
      budget_type: acquisitionSettings.budgetType || 'NONE',
      faab_budget: acquisitionSettings.budget || 100,
      minimum_bid: acquisitionSettings.minimumBid || 0,
      waiver_process_days: acquisitionSettings.waiverProcessDays || []
    };
  }

  /**
   * Normalize trade settings
   */
  normalizeTradeSettings(tradeSettings) {
    if (!tradeSettings) return {};

    return {
      deadline_date: tradeSettings.deadlineDate || null,
      veto_votes_required: tradeSettings.vetoVotesRequired || 4,
      allow_out_of_universe: tradeSettings.allowOutOfUniverse || false
    };
  }

  /**
   * Normalize teams array
   */
  normalizeTeams(teams) {
    if (!Array.isArray(teams)) return [];

    return teams.map(team => this.normalizeTeam(team)).filter(Boolean);
  }

  /**
   * Normalize individual team
   */
  normalizeTeam(team) {
    if (!team) return null;

    try {
      return {
        team_id: team.id?.toString() || 'unknown',
        name: `${team.location || ''} ${team.nickname || ''}`.trim() || 'Unknown Team',
        abbreviation: team.abbrev || team.nickname?.substring(0, 3).toUpperCase() || 'UNK',
        location: team.location || '',
        nickname: team.nickname || '',
        
        // Owner information
        owner: team.primaryOwner || team.owners?.[0] || 'Unknown Owner',
        owners: team.owners || [team.primaryOwner || 'Unknown Owner'],
        
        // Visual elements
        logo_url: team.logo || null,
        
        // Record and standings
        record: this.normalizeRecord(team.record),
        standing: team.playoffSeed || team.draftDayProjectedRank || null,
        
        // Points and scoring
        points: this.normalizePoints(team.record),
        
        // Roster
        roster: this.normalizeRoster(team.roster),
        
        // Draft information
        draft_day_projected_rank: team.draftDayProjectedRank || null,
        
        // Playoff information
        playoff_seed: team.playoffSeed || null
      };
    } catch (error) {
      logger.error(`Error normalizing team ${team.id}:`, error);
      return null;
    }
  }

  /**
   * Normalize team record
   */
  normalizeRecord(record) {
    if (!record?.overall) {
      return {
        wins: 0,
        losses: 0,
        ties: 0,
        win_percentage: 0
      };
    }

    const { wins = 0, losses = 0, ties = 0, percentage = 0 } = record.overall;
    
    return {
      wins,
      losses, 
      ties,
      win_percentage: percentage,
      games_played: wins + losses + ties
    };
  }

  /**
   * Normalize team points
   */
  normalizePoints(record) {
    if (!record?.overall) {
      return {
        total: 0,
        average: 0,
        against: 0
      };
    }

    const { pointsFor = 0, pointsAgainst = 0, gamesPlayed = 1 } = record.overall;
    
    return {
      total: Math.round(pointsFor * 100) / 100,
      average: Math.round((pointsFor / Math.max(gamesPlayed, 1)) * 100) / 100,
      against: Math.round(pointsAgainst * 100) / 100
    };
  }

  /**
   * Normalize team roster
   */
  normalizeRoster(roster) {
    if (!roster?.entries) {
      return {
        starters: [],
        bench: [],
        ir: [],
        total_count: 0
      };
    }

    const starters = [];
    const bench = [];
    const ir = [];

    roster.entries.forEach(entry => {
      const player = this.normalizePlayer(entry.playerPoolEntry?.player, entry);
      if (!player) return;
      
      const lineupSlot = entry.lineupSlotId;
      
      if (lineupSlot === 20) { // Bench
        bench.push(player);
      } else if (lineupSlot === 21) { // IR
        ir.push(player);
      } else {
        starters.push(player);
      }
    });

    return {
      starters,
      bench,
      ir,
      total_count: starters.length + bench.length + ir.length
    };
  }

  /**
   * Normalize individual player
   */
  normalizePlayer(player, entry) {
    if (!player) return null;

    try {
      return {
        player_id: player.id?.toString() || 'unknown',
        name: player.fullName || 'Unknown Player',
        position: this.positionMap[player.defaultPositionId] || 'UNKNOWN',
        nfl_team: this.nflTeamMap[player.proTeamId] || 'FA',
        nfl_team_id: player.proTeamId || 0,
        
        // Status information
        injury_status: player.injuryStatus || 'ACTIVE',
        lineup_slot: entry?.lineupSlotId || 20,
        lineup_slot_name: this.lineupSlotMap[entry?.lineupSlotId] || 'BENCH',
        
        // Acquisition information
        acquisition_type: this.acquisitionTypeMap[entry?.acquisitionType] || 'UNKNOWN',
        acquisition_date: entry?.acquisitionDate || null,
        
        // Statistics
        stats: this.normalizePlayerStats(player.stats),
        
        // Projected points
        projected_points: this.getProjectedPoints(player),
        actual_points: this.getActualPoints(player),
        
        // Ownership information
        ownership: this.normalizeOwnership(player.ownership),
        
        // Eligibility
        eligible_slots: player.eligibleSlots || [],
        
        // News and updates
        news: this.normalizePlayerNews(player.news)
      };
    } catch (error) {
      logger.error(`Error normalizing player ${player.id}:`, error);
      return null;
    }
  }

  /**
   * Normalize player statistics
   */
  normalizePlayerStats(stats) {
    if (!stats) return {};

    try {
      const normalized = {};
      
      // Process each stat period (weeks)
      stats.forEach((statPeriod, index) => {
        if (statPeriod.stats) {
          normalized[`week_${index + 1}`] = statPeriod.stats;
        }
        
        if (statPeriod.appliedTotal !== undefined) {
          normalized.season_total = statPeriod.appliedTotal;
        }
      });

      return normalized;
    } catch (error) {
      logger.error('Error normalizing player stats:', error);
      return {};
    }
  }

  /**
   * Extract projected points
   */
  getProjectedPoints(player) {
    try {
      if (player.stats) {
        // Look for current week projected points
        const currentWeek = player.stats.find(s => s.scoringPeriodId === new Date().getWeek());
        return currentWeek?.projectedStats?.appliedTotal || 0;
      }
      return 0;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Extract actual points
   */
  getActualPoints(player) {
    try {
      if (player.stats) {
        // Look for current week actual points
        const currentWeek = player.stats.find(s => s.scoringPeriodId === new Date().getWeek());
        return currentWeek?.stats?.appliedTotal || 0;
      }
      return 0;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Normalize player ownership data
   */
  normalizeOwnership(ownership) {
    if (!ownership) return {};

    return {
      percent_owned: ownership.percentOwned || 0,
      percent_started: ownership.percentStarted || 0,
      percent_change: ownership.percentChange || 0
    };
  }

  /**
   * Normalize player news
   */
  normalizePlayerNews(news) {
    if (!news) return null;

    return {
      headline: news.headline || null,
      description: news.description || null,
      date: news.date || null
    };
  }

  /**
   * Generate standings from teams data
   */
  generateStandings(teams) {
    if (!Array.isArray(teams)) return [];

    try {
      return teams
        .map(team => ({
          rank: team.playoffSeed || team.draftDayProjectedRank || 999,
          team_id: team.id?.toString(),
          name: `${team.location || ''} ${team.nickname || ''}`.trim(),
          owner: team.primaryOwner || 'Unknown',
          record: this.normalizeRecord(team.record),
          points: this.normalizePoints(team.record)
        }))
        .sort((a, b) => {
          // Sort by wins, then by total points
          if (a.record.wins !== b.record.wins) {
            return b.record.wins - a.record.wins;
          }
          return b.points.total - a.points.total;
        })
        .map((team, index) => ({
          ...team,
          rank: index + 1
        }));
    } catch (error) {
      logger.error('Error generating standings:', error);
      return [];
    }
  }

  /**
   * Normalize current scoreboard
   */
  normalizeScoreboard(schedule) {
    if (!Array.isArray(schedule)) return [];

    try {
      // Get current week matchups
      const currentWeek = new Date().getWeek() || 1;
      const currentMatchups = schedule.filter(matchup => 
        matchup.matchupPeriodId === currentWeek
      );

      return currentMatchups.map(matchup => ({
        matchup_id: matchup.id || null,
        week: matchup.matchupPeriodId || currentWeek,
        home_team: this.normalizeMatchupTeam(matchup.home),
        away_team: this.normalizeMatchupTeam(matchup.away),
        status: matchup.winner ? 'FINAL' : 'IN_PROGRESS'
      }));
    } catch (error) {
      logger.error('Error normalizing scoreboard:', error);
      return [];
    }
  }

  /**
   * Normalize matchup team data
   */
  normalizeMatchupTeam(teamMatchup) {
    if (!teamMatchup) return null;

    return {
      team_id: teamMatchup.teamId?.toString(),
      score: Math.round((teamMatchup.totalPoints || 0) * 100) / 100,
      projected_score: Math.round((teamMatchup.totalProjectedPoints || 0) * 100) / 100
    };
  }

  /**
   * Normalize recent activity
   */
  normalizeActivity(recentActivity) {
    if (!Array.isArray(recentActivity)) return [];

    try {
      return recentActivity.slice(0, 10).map(activity => ({
        type: activity.type || 'unknown',
        date: activity.date || null,
        description: activity.messages?.[0] || 'Activity occurred',
        player_involved: activity.player || null,
        teams_involved: activity.teams || []
      }));
    } catch (error) {
      logger.error('Error normalizing activity:', error);
      return [];
    }
  }

  /**
   * Normalize draft information
   */
  normalizeDraftInfo(draftDetail) {
    if (!draftDetail) return null;

    try {
      return {
        drafted: draftDetail.drafted || false,
        draft_date: draftDetail.date || null,
        draft_type: draftDetail.type || 'SNAKE',
        picks: draftDetail.picks?.map(pick => ({
          pick_number: pick.overallPickNumber,
          round: pick.roundId,
          team_id: pick.teamId?.toString(),
          player_id: pick.playerId?.toString(),
          keeper_status: pick.keeper || false
        })) || []
      };
    } catch (error) {
      logger.error('Error normalizing draft info:', error);
      return null;
    }
  }

  /**
   * Normalize error responses
   */
  normalizeError(error) {
    return {
      success: false,
      error_code: error.error || 'UNKNOWN_ERROR',
      error_message: error.message || 'An unknown error occurred',
      error_type: this.categorizeError(error),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Categorize error types
   */
  categorizeError(error) {
    const errorCode = error.error || '';
    
    if (errorCode.includes('AUTH')) return 'AUTHENTICATION_ERROR';
    if (errorCode.includes('ACCESS')) return 'AUTHORIZATION_ERROR';
    if (errorCode.includes('TIMEOUT')) return 'TIMEOUT_ERROR';
    if (errorCode.includes('NOT_FOUND')) return 'NOT_FOUND_ERROR';
    if (errorCode.includes('SERVER')) return 'SERVER_ERROR';
    if (errorCode.includes('NETWORK')) return 'NETWORK_ERROR';
    
    return 'API_ERROR';
  }
}

// Helper to get current week number
Date.prototype.getWeek = function() {
  const start = new Date(this.getFullYear(), 8, 1); // September 1st
  const diff = this - start;
  return Math.ceil(diff / (7 * 24 * 60 * 60 * 1000));
};

module.exports = ESPNDataNormalizer;