const express = require('express');
const router = express.Router();
const StreamingControlService = require('../services/StreamingControlService');
const authMiddleware = require('../middlewares/authMiddleware');

// Middleware de autenticação
router.use(authMiddleware);

/**
 * POST /api/streaming-control/ligar
 * Ligar streaming
 */
router.post('/ligar', async (req, res) => {
    try {
        const { login } = req.body;

        if (!login) {
            return res.status(400).json({
                success: false,
                message: 'Login do streaming é obrigatório'
            });
        }

        const result = await StreamingControlService.ligarStreaming(login);

        if (result.success) {
            return res.json(result);
        } else {
            return res.status(result.alreadyActive ? 200 : 500).json(result);
        }

    } catch (error) {
        console.error('Erro ao ligar streaming:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno ao ligar streaming',
            error: error.message
        });
    }
});

/**
 * POST /api/streaming-control/desligar
 * Desligar streaming
 */
router.post('/desligar', async (req, res) => {
    try {
        const { login } = req.body;

        if (!login) {
            return res.status(400).json({
                success: false,
                message: 'Login do streaming é obrigatório'
            });
        }

        const result = await StreamingControlService.desligarStreaming(login);

        if (result.success) {
            return res.json(result);
        } else {
            return res.status(result.alreadyInactive ? 200 : 500).json(result);
        }

    } catch (error) {
        console.error('Erro ao desligar streaming:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno ao desligar streaming',
            error: error.message
        });
    }
});

/**
 * POST /api/streaming-control/reiniciar
 * Reiniciar streaming
 */
router.post('/reiniciar', async (req, res) => {
    try {
        const { login } = req.body;

        if (!login) {
            return res.status(400).json({
                success: false,
                message: 'Login do streaming é obrigatório'
            });
        }

        const result = await StreamingControlService.reiniciarStreaming(login);

        if (result.success) {
            return res.json(result);
        } else {
            return res.status(500).json(result);
        }

    } catch (error) {
        console.error('Erro ao reiniciar streaming:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno ao reiniciar streaming',
            error: error.message
        });
    }
});

/**
 * POST /api/streaming-control/bloquear
 * Bloquear streaming (apenas admin/revenda)
 */
router.post('/bloquear', async (req, res) => {
    try {
        const { login } = req.body;
        const userType = req.user?.type || req.user?.tipo;

        if (!login) {
            return res.status(400).json({
                success: false,
                message: 'Login do streaming é obrigatório'
            });
        }

        if (!userType || (userType !== 'admin' && userType !== 'revenda')) {
            return res.status(403).json({
                success: false,
                message: 'Acesso não autorizado'
            });
        }

        const result = await StreamingControlService.bloquearStreaming(login, userType);

        if (result.success) {
            return res.json(result);
        } else {
            return res.status(500).json(result);
        }

    } catch (error) {
        console.error('Erro ao bloquear streaming:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno ao bloquear streaming',
            error: error.message
        });
    }
});

/**
 * POST /api/streaming-control/desbloquear
 * Desbloquear streaming (apenas admin/revenda)
 */
router.post('/desbloquear', async (req, res) => {
    try {
        const { login } = req.body;
        const userType = req.user?.type || req.user?.tipo;

        if (!login) {
            return res.status(400).json({
                success: false,
                message: 'Login do streaming é obrigatório'
            });
        }

        if (!userType || (userType !== 'admin' && userType !== 'revenda')) {
            return res.status(403).json({
                success: false,
                message: 'Acesso não autorizado'
            });
        }

        const result = await StreamingControlService.desbloquearStreaming(login, userType);

        if (result.success) {
            return res.json(result);
        } else {
            return res.status(500).json(result);
        }

    } catch (error) {
        console.error('Erro ao desbloquear streaming:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno ao desbloquear streaming',
            error: error.message
        });
    }
});

/**
 * DELETE /api/streaming-control/remover
 * Remover streaming (apenas admin/revenda)
 */
router.delete('/remover', async (req, res) => {
    try {
        const { login } = req.body;
        const userType = req.user?.type || req.user?.tipo;

        if (!login) {
            return res.status(400).json({
                success: false,
                message: 'Login do streaming é obrigatório'
            });
        }

        if (!userType || (userType !== 'admin' && userType !== 'revenda')) {
            return res.status(403).json({
                success: false,
                message: 'Acesso não autorizado'
            });
        }

        const result = await StreamingControlService.removerStreaming(login, userType);

        if (result.success) {
            return res.json(result);
        } else {
            return res.status(500).json(result);
        }

    } catch (error) {
        console.error('Erro ao remover streaming:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno ao remover streaming',
            error: error.message
        });
    }
});

/**
 * GET /api/streaming-control/status/:login
 * Verificar status do streaming
 */
router.get('/status/:login', async (req, res) => {
    try {
        const { login } = req.params;

        if (!login) {
            return res.status(400).json({
                success: false,
                message: 'Login do streaming é obrigatório'
            });
        }

        // Buscar configurações globais (opcional)
        const db = require('../config/database');
        const [configRows] = await db.execute('SELECT * FROM configuracoes LIMIT 1');
        const configData = configRows.length > 0 ? configRows[0] : null;

        const result = await StreamingControlService.verificarStatus(login, configData);

        return res.json({
            success: true,
            ...result
        });

    } catch (error) {
        console.error('Erro ao verificar status:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno ao verificar status',
            error: error.message
        });
    }
});

/**
 * GET /api/streaming/status
 * Verificar status de transmissão ativa
 */
router.get('/status', async (req, res) => {
    try {
        const userId = req.user?.id || req.user?.codigo;
        const db = require('../config/database');

        // Verificar se há transmissão ativa
        const [transmissions] = await db.execute(
            `SELECT t.*, p.nome as playlist_nome, p.id as codigo_playlist
             FROM transmissoes t
             LEFT JOIN playlists p ON t.codigo_playlist = p.id
             WHERE t.codigo_stm = ? AND t.status = 'ativa'
             ORDER BY t.data_inicio DESC
             LIMIT 1`,
            [userId]
        );

        if (transmissions.length === 0) {
            return res.json({
                is_live: false,
                stream_type: null,
                transmission: null
            });
        }

        const transmission = transmissions[0];

        return res.json({
            is_live: true,
            stream_type: transmission.codigo_playlist ? 'playlist' : 'obs',
            transmission: {
                id: transmission.codigo,
                titulo: transmission.titulo,
                codigo_playlist: transmission.codigo_playlist,
                stats: {
                    viewers: 0,
                    bitrate: 0,
                    uptime: '00:00:00',
                    isActive: true
                },
                platforms: []
            }
        });

    } catch (error) {
        console.error('Erro ao verificar status:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno ao verificar status',
            error: error.message
        });
    }
});

/**
 * POST /api/streaming/start
 * Iniciar transmissão de playlist
 */
router.post('/start', async (req, res) => {
    try {
        const userId = req.user?.id || req.user?.codigo;
        const { titulo, descricao, playlist_id, platform_ids, enable_recording, use_smil, loop_playlist } = req.body;
        const db = require('../config/database');

        if (!playlist_id) {
            return res.status(400).json({
                success: false,
                error: 'ID da playlist é obrigatório'
            });
        }

        // Verificar se playlist existe e pertence ao usuário
        const [playlists] = await db.execute(
            'SELECT id, nome FROM playlists WHERE id = ? AND codigo_stm = ?',
            [playlist_id, userId]
        );

        if (playlists.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Playlist não encontrada'
            });
        }

        // Verificar se há transmissão ativa
        const [activeTransmissions] = await db.execute(
            'SELECT codigo FROM transmissoes WHERE codigo_stm = ? AND status = "ativa"',
            [userId]
        );

        if (activeTransmissions.length > 0) {
            // Finalizar transmissão ativa
            await db.execute(
                'UPDATE transmissoes SET status = "finalizada", data_fim = NOW() WHERE codigo = ?',
                [activeTransmissions[0].codigo]
            );
        }

        // Criar nova transmissão
        const [result] = await db.execute(
            `INSERT INTO transmissoes
             (codigo_stm, titulo, descricao, codigo_playlist, status, data_inicio, tipo_transmissao)
             VALUES (?, ?, ?, ?, 'ativa', NOW(), 'playlist')`,
            [userId, titulo, descricao || '', playlist_id]
        );

        const transmissionId = result.insertId;

        // Atualizar arquivo SMIL
        try {
            const userLogin = req.user.usuario || `user_${userId}`;
            const [serverRows] = await db.execute(
                `SELECT servidor_id FROM folders WHERE user_id = ? LIMIT 1`,
                [userId]
            );
            const serverId = serverRows.length > 0 ? serverRows[0].servidor_id : 1;

            const PlaylistSMILService = require('../services/PlaylistSMILService');
            await PlaylistSMILService.updateUserSMIL(userId, userLogin, serverId);
            console.log(`✅ Arquivo SMIL atualizado para transmissão da playlist ${playlist_id}`);
        } catch (smilError) {
            console.warn('Erro ao atualizar arquivo SMIL:', smilError.message);
        }

        // Construir URLs do player
        const userLogin = req.user.usuario || `user_${userId}`;
        const baseUrl = process.env.NODE_ENV === 'production'
            ? 'https://samhost.wcore.com.br:3001'
            : 'http://localhost:3001';

        return res.json({
            success: true,
            transmission_id: transmissionId,
            message: 'Transmissão iniciada com sucesso',
            player_urls: {
                iframe: `${baseUrl}/api/player-port/iframe?login=${userLogin}&playlist=${playlist_id}&player=1&contador=true&compartilhamento=true`,
                direct: `https://stmv1.udicast.com:1935/${userLogin}/${userLogin}/playlist.m3u8`
            }
        });

    } catch (error) {
        console.error('Erro ao iniciar transmissão:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno ao iniciar transmissão',
            details: error.message
        });
    }
});

/**
 * POST /api/streaming/stop
 * Finalizar transmissão
 */
router.post('/stop', async (req, res) => {
    try {
        const { transmission_id, stream_type } = req.body;
        const db = require('../config/database');

        if (!transmission_id) {
            return res.status(400).json({
                success: false,
                error: 'ID da transmissão é obrigatório'
            });
        }

        // Finalizar transmissão
        await db.execute(
            'UPDATE transmissoes SET status = "finalizada", data_fim = NOW() WHERE codigo = ?',
            [transmission_id]
        );

        return res.json({
            success: true,
            message: 'Transmissão finalizada com sucesso'
        });

    } catch (error) {
        console.error('Erro ao finalizar transmissão:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno ao finalizar transmissão',
            details: error.message
        });
    }
});

/**
 * GET /api/streaming-control/list
 * Listar streamings do usuário
 */
router.get('/list', async (req, res) => {
    try {
        const userId = req.user?.id || req.user?.codigo;
        const db = require('../config/database');

        const [streamings] = await db.execute(
            `SELECT s.*, srv.nome as servidor_nome, srv.status as servidor_status
             FROM streamings s
             LEFT JOIN servidores srv ON s.codigo_servidor = srv.codigo
             WHERE s.codigo_cliente = ?
             ORDER BY s.login`,
            [userId]
        );

        return res.json({
            success: true,
            streamings
        });

    } catch (error) {
        console.error('Erro ao listar streamings:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno ao listar streamings',
            error: error.message
        });
    }
});

module.exports = router;