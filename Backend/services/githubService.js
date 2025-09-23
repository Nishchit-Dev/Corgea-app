const axios = require('axios');
const crypto = require('crypto');
const pool = require('../config/database');

// Simple encryption/decryption for tokens
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-32-character-secret-key-here!';
const ALGORITHM = 'aes-256-cbc';

function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

function decrypt(encryptedText) {
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedData = textParts.join(':');
    const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

class GitHubService {
    constructor() {
        this.clientId = process.env.GITHUB_CLIENT_ID;
        this.clientSecret = process.env.GITHUB_CLIENT_SECRET;
        this.redirectUri = process.env.GITHUB_REDIRECT_URI || 'http://localhost:3000/api/github/callback';
        this.baseURL = 'https://api.github.com';
    }

    // Generate GitHub OAuth URL
    generateAuthURL(state) {
        const params = new URLSearchParams({
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            scope: 'repo,read:user,read:org',
            state: state,
            allow_signup: 'true'
        });

        return `https://github.com/login/oauth/authorize?${params.toString()}`;
    }

    // Exchange code for access token
    async exchangeCodeForToken(code) {
        try {
            // GitHub recommends x-www-form-urlencoded for this endpoint
            const params = new URLSearchParams({
                client_id: this.clientId,
                client_secret: this.clientSecret,
                code: code,
                redirect_uri: this.redirectUri
            });

            const response = await axios.post(
                'https://github.com/login/oauth/access_token',
                params.toString(),
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            return response.data;
        } catch (error) {
            const status = error.response?.status;
            const data = error.response?.data;
            console.error('GitHub token exchange error:', { status, data, message: error.message, redirectUri: this.redirectUri });
            throw new Error(data?.error_description || 'Failed to get access token');
        }
    }

    // Get GitHub user information
    async getUserInfo(accessToken) {
        try {
            const response = await axios.get(`${this.baseURL}/user`, {
                headers: {
                    'Authorization': `token ${accessToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            return response.data;
        } catch (error) {
            console.error('GitHub user info error:', error);
            throw new Error('Failed to get user information');
        }
    }

    // Get user repositories
    async getUserRepositories(accessToken, page = 1, perPage = 100) {
        try {
            const response = await axios.get(`${this.baseURL}/user/repos`, {
                headers: {
                    'Authorization': `token ${accessToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                },
                params: {
                    page,
                    per_page: perPage,
                    sort: 'updated',
                    direction: 'desc'
                }
            });

            return response.data;
        } catch (error) {
            console.error('GitHub repositories error:', error);
            throw new Error('Failed to get repositories');
        }
    }

    // Get repository contents
    async getRepositoryContents(accessToken, owner, repo, path = '', ref = 'main') {
        try {
            const url = `${this.baseURL}/repos/${owner}/${repo}/contents/${path}`;
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `token ${accessToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                },
                params: {
                    ref: ref
                }
            });

            return response.data;
        } catch (error) {
            console.error('GitHub repository contents error:', error);
            throw new Error('Failed to get repository contents');
        }
    }

    // Get file content
    async getFileContent(accessToken, owner, repo, path, ref = 'main') {
        try {
            const url = `${this.baseURL}/repos/${owner}/${repo}/contents/${path}`;
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `token ${accessToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                },
                params: {
                    ref: ref
                }
            });

            // Decode base64 content
            const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
            return {
                ...response.data,
                content: content
            };
        } catch (error) {
            console.error('GitHub file content error:', error);
            throw new Error('Failed to get file content');
        }
    }

    // Get repository languages
    async getRepositoryLanguages(accessToken, owner, repo) {
        try {
            const response = await axios.get(`${this.baseURL}/repos/${owner}/${repo}/languages`, {
                headers: {
                    'Authorization': `token ${accessToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            return response.data;
        } catch (error) {
            console.error('GitHub languages error:', error);
            throw new Error('Failed to get repository languages');
        }
    }

    // Get repository commits
    async getRepositoryCommits(accessToken, owner, repo, branch = 'main', perPage = 10) {
        try {
            const response = await axios.get(`${this.baseURL}/repos/${owner}/${repo}/commits`, {
                headers: {
                    'Authorization': `token ${accessToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                },
                params: {
                    sha: branch,
                    per_page: perPage
                }
            });

            return response.data;
        } catch (error) {
            console.error('GitHub commits error:', error);
            throw new Error('Failed to get repository commits');
        }
    }

    // Hash sensitive data
    hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    // Store GitHub account in database
    async storeGitHubAccount(userId, githubData, tokenData) {
        try {
            const { id, login, name, avatar_url } = githubData;
            const { access_token, refresh_token, expires_in } = tokenData;

            const query = `
                INSERT INTO github_accounts 
                (user_id, github_id, username, display_name, avatar_url, access_token_encrypted, access_token_hash, refresh_token_encrypted, refresh_token_hash, token_expires_at, scopes)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                ON CONFLICT (github_id) 
                DO UPDATE SET 
                    access_token_encrypted = EXCLUDED.access_token_encrypted,
                    access_token_hash = EXCLUDED.access_token_hash,
                    refresh_token_encrypted = EXCLUDED.refresh_token_encrypted,
                    refresh_token_hash = EXCLUDED.refresh_token_hash,
                    token_expires_at = EXCLUDED.token_expires_at,
                    updated_at = CURRENT_TIMESTAMP
                RETURNING id
            `;

            const expiresAt = expires_in ? new Date(Date.now() + expires_in * 1000) : null;
            const scopes = ['repo', 'read:user', 'read:org'];

            const result = await pool.query(query, [
                userId,
                id,
                login,
                name,
                avatar_url,
                encrypt(access_token),
                this.hashToken(access_token),
                refresh_token ? encrypt(refresh_token) : null,
                refresh_token ? this.hashToken(refresh_token) : null,
                expiresAt,
                scopes
            ]);

            return result.rows[0].id;
        } catch (error) {
            console.error('Store GitHub account error:', error);
            throw new Error('Failed to store GitHub account');
        }
    }

    // Store repositories in database
    async storeRepositories(githubAccountId, repositories) {
        try {
            const query = `
                INSERT INTO repositories 
                (github_account_id, github_repo_id, name, full_name, description, language, is_private, default_branch, clone_url, html_url, last_updated)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                ON CONFLICT (github_repo_id) 
                DO UPDATE SET 
                    name = EXCLUDED.name,
                    full_name = EXCLUDED.full_name,
                    description = EXCLUDED.description,
                    language = EXCLUDED.language,
                    is_private = EXCLUDED.is_private,
                    default_branch = EXCLUDED.default_branch,
                    clone_url = EXCLUDED.clone_url,
                    html_url = EXCLUDED.html_url,
                    last_updated = EXCLUDED.last_updated,
                    updated_at = CURRENT_TIMESTAMP
            `;

            for (const repo of repositories) {
                await pool.query(query, [
                    githubAccountId,
                    repo.id,
                    repo.name,
                    repo.full_name,
                    repo.description,
                    repo.language,
                    repo.private,
                    repo.default_branch,
                    repo.clone_url,
                    repo.html_url,
                    new Date(repo.updated_at)
                ]);
            }
        } catch (error) {
            console.error('Store repositories error:', error);
            throw new Error('Failed to store repositories');
        }
    }

    // Get user's GitHub account
    async getGitHubAccount(userId) {
        try {
            const query = 'SELECT * FROM github_accounts WHERE user_id = $1';
            const result = await pool.query(query, [userId]);
            return result.rows[0] || null;
        } catch (error) {
            console.error('Get GitHub account error:', error);
            throw new Error('Failed to get GitHub account');
        }
    }

    // Get user's repositories
    async getUserRepositoriesFromDB(userId) {
        try {
            const query = `
                SELECT r.*, ga.username as owner_username
                FROM repositories r
                JOIN github_accounts ga ON r.github_account_id = ga.id
                WHERE ga.user_id = $1
                ORDER BY r.updated_at DESC
            `;
            const result = await pool.query(query, [userId]);
            return result.rows;
        } catch (error) {
            console.error('Get user repositories error:', error);
            throw new Error('Failed to get user repositories');
        }
    }

    // Get decrypted access token for a user
    async getAccessToken(userId) {
        try {
            const query = 'SELECT access_token_encrypted FROM github_accounts WHERE user_id = $1';
            const result = await pool.query(query, [userId]);
            if (result.rows.length === 0) {
                throw new Error('GitHub account not found');
            }
            const enc = result.rows[0].access_token_encrypted;
            if (!enc) {
                throw new Error('GitHub token not stored yet. Please disconnect and reconnect.');
            }
            return decrypt(enc);
        } catch (error) {
            console.error('Get access token error:', error);
            throw new Error('Failed to get access token');
        }
    }
}

module.exports = new GitHubService();
