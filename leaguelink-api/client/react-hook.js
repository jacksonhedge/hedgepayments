/**
 * React Hook for LeagueLink Integration
 * Provides easy integration for React applications
 */

import { useState, useCallback, useEffect } from 'react';
import LeagueLinkClient from './LeagueLink';

/**
 * Custom React Hook for LeagueLink
 * @param {string} clientId - Your LeagueLink client ID
 * @param {string} environment - Environment ('sandbox' or 'production')
 * @returns {object} - Hook methods and state
 */
export function useLeagueLink(clientId, environment = 'sandbox') {
    const [isConnecting, setIsConnecting] = useState(false);
    const [leagues, setLeagues] = useState([]);
    const [accessToken, setAccessToken] = useState(null);
    const [error, setError] = useState(null);
    const [selectedLeague, setSelectedLeague] = useState(null);
    const [platform, setPlatform] = useState(null);

    // Initialize client
    const client = new LeagueLinkClient(clientId, environment);

    // Load saved access token from localStorage
    useEffect(() => {
        const savedToken = localStorage.getItem('leaguelink_access_token');
        const savedPlatform = localStorage.getItem('leaguelink_platform');
        if (savedToken) {
            setAccessToken(savedToken);
            setPlatform(savedPlatform);
            // Optionally fetch leagues on mount
            fetchLeagues(savedToken);
        }
    }, []);

    /**
     * Connect to a fantasy platform
     */
    const connect = useCallback(async (platform, clientSecret, redirectUri = window.location.origin) => {
        setIsConnecting(true);
        setError(null);

        try {
            // Step 1: Open popup and get public token
            const authResult = await client.connect(platform, redirectUri);
            
            // Step 2: Exchange public token for access token
            const tokenResult = await client.exchangeToken(
                authResult.public_token,
                clientSecret
            );

            // Save to state and localStorage
            setAccessToken(tokenResult.access_token);
            setPlatform(platform);
            localStorage.setItem('leaguelink_access_token', tokenResult.access_token);
            localStorage.setItem('leaguelink_platform', platform);

            // Step 3: Fetch user's leagues
            const leaguesData = await client.getLeagues(tokenResult.access_token);
            setLeagues(leaguesData.leagues || []);

            return {
                success: true,
                access_token: tokenResult.access_token,
                leagues_count: authResult.leagues_found
            };

        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsConnecting(false);
        }
    }, [client]);

    /**
     * Connect to ESPN specifically
     */
    const connectESPN = useCallback(async (clientSecret, redirectUri) => {
        return connect('espn', clientSecret, redirectUri);
    }, [connect]);

    /**
     * Fetch leagues using existing access token
     */
    const fetchLeagues = useCallback(async (token = accessToken) => {
        if (!token) {
            setError('No access token available');
            return;
        }

        try {
            const leaguesData = await client.getLeagues(token);
            setLeagues(leaguesData.leagues || []);
            return leaguesData.leagues;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [client, accessToken]);

    /**
     * Fetch specific league details
     */
    const fetchLeague = useCallback(async (leagueId, token = accessToken) => {
        if (!token) {
            setError('No access token available');
            return;
        }

        try {
            const leagueData = await client.getLeague(token, leagueId);
            setSelectedLeague(leagueData);
            return leagueData;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [client, accessToken]);

    /**
     * Fetch team roster
     */
    const fetchRoster = useCallback(async (leagueId, teamId = null, token = accessToken) => {
        if (!token) {
            setError('No access token available');
            return;
        }

        try {
            return await client.getRoster(token, leagueId, teamId);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [client, accessToken]);

    /**
     * Fetch matchups
     */
    const fetchMatchups = useCallback(async (leagueId, week = null, token = accessToken) => {
        if (!token) {
            setError('No access token available');
            return;
        }

        try {
            return await client.getMatchups(token, leagueId, week);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [client, accessToken]);

    /**
     * Disconnect and clear session
     */
    const disconnect = useCallback(() => {
        setAccessToken(null);
        setLeagues([]);
        setSelectedLeague(null);
        setPlatform(null);
        setError(null);
        localStorage.removeItem('leaguelink_access_token');
        localStorage.removeItem('leaguelink_platform');
    }, []);

    /**
     * Check if connected
     */
    const isConnected = Boolean(accessToken);

    return {
        // Connection methods
        connect,
        connectESPN,
        disconnect,
        
        // Data fetching methods
        fetchLeagues,
        fetchLeague,
        fetchRoster,
        fetchMatchups,
        
        // State
        isConnecting,
        isConnected,
        leagues,
        selectedLeague,
        accessToken,
        platform,
        error,
        
        // Utilities
        clearError: () => setError(null)
    };
}

/**
 * Example React Component using the hook
 */
export function LeagueLinkButton({ clientId, clientSecret }) {
    const {
        connectESPN,
        disconnect,
        isConnecting,
        isConnected,
        leagues,
        error,
        platform
    } = useLeagueLink(clientId);

    const handleConnect = async () => {
        try {
            await connectESPN(clientSecret);
        } catch (err) {
            console.error('Connection failed:', err);
        }
    };

    if (error) {
        return (
            <div className="error-message">
                <p>Error: {error}</p>
                <button onClick={() => window.location.reload()}>
                    Try Again
                </button>
            </div>
        );
    }

    if (isConnected) {
        return (
            <div className="connected-status">
                <h3>Connected to {platform}</h3>
                <p>{leagues.length} league(s) found</p>
                <ul>
                    {leagues.map(league => (
                        <li key={league.league_id}>
                            {league.name} ({league.total_teams} teams)
                        </li>
                    ))}
                </ul>
                <button onClick={disconnect}>
                    Disconnect
                </button>
            </div>
        );
    }

    return (
        <button 
            onClick={handleConnect}
            disabled={isConnecting}
            className="connect-button"
        >
            {isConnecting ? 'Connecting...' : '🏆 Connect ESPN Fantasy'}
        </button>
    );
}

export default useLeagueLink;