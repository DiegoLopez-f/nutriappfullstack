import { api } from '../lib/api';
import { auth } from '../lib/firebase';

global.fetch = jest.fn() as jest.Mock;

jest.mock('../lib/firebase', () => {
    return {
        auth: {
            currentUser: {
                getIdToken: jest.fn(),
            }
        }
    };
});

const mockedFetch = global.fetch as jest.Mock;
// @ts-ignore
const mockedGetToken = auth.currentUser.getIdToken as jest.Mock;

describe('Cliente API (api.ts)', () => {

    beforeEach(() => {
        mockedFetch.mockClear();
        mockedGetToken.mockClear();
        mockedGetToken.mockResolvedValue('token-simulado-abc-123');
    });

    describe('Usuarios y Perfil', () => {
        it('getPerfil: Debería obtener los datos del usuario con el token correcto', async () => {
            mockedFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ uid: '123', nombre: 'Test User' })
            });

            await api.getPerfil();

            expect(mockedFetch).toHaveBeenCalledWith(
                expect.stringContaining('/perfil'),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'Authorization': 'Bearer token-simulado-abc-123'
                    })
                })
            );
        });

        it('actualizarPerfil: Debería enviar los datos modificados por PUT', async () => {
            mockedFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true })
            });

            const datosNuevos = { peso: 75, objetivo: 'Volumen' };
            await api.actualizarPerfil(datosNuevos);

            expect(mockedFetch).toHaveBeenCalledWith(
                expect.stringContaining('/perfil'),
                expect.objectContaining({
                    method: 'PUT',
                    body: JSON.stringify(datosNuevos),
                    headers: expect.objectContaining({
                        'Content-Type': 'application/json'
                    })
                })
            );
        });

        it('registrarUsuario: Debería crear un usuario nuevo por POST', async () => {
            mockedFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ message: 'Creado' })
            });

            const nuevoUsuario = { uid: 'u1', email: 'a@b.com', tipo: 2 };
            await api.registrarUsuario(nuevoUsuario);

            expect(mockedFetch).toHaveBeenCalledWith(
                expect.stringContaining('/usuarios'),
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify(nuevoUsuario)
                })
            );
        });
    });

    describe('Catálogo de Alimentos', () => {
        it('getAlimentos: Debería solicitar la lista maestra', async () => {
            mockedFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => [{ id: 'manzana', nombre: 'Manzana' }]
            });

            await api.getAlimentos();

            expect(mockedFetch).toHaveBeenCalledWith(
                expect.stringContaining('/alimentos'),
                expect.anything()
            );
        });
    });

    describe('Gestión de Planes', () => {
        it('crearPlan: Debería enviar el payload completo del plan', async () => {
            mockedFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ id: 'plan-new' })
            });

            const planPayload: any = {
                pacienteId: 'p1',
                nombre: 'Plan X',
                tipo: 'Volumen',
                comidas: []
            };

            await api.crearPlan(planPayload);

            expect(mockedFetch).toHaveBeenCalledWith(
                expect.stringContaining('/planes'),
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify(planPayload)
                })
            );
        });

        it('getMisPlanes: Debería consultar los planes asignados al usuario logueado', async () => {
            mockedFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => []
            });

            await api.getMisPlanes();

            expect(mockedFetch).toHaveBeenCalledWith(
                expect.stringContaining('/planes/asignados'),
                expect.anything()
            );
        });

        it('eliminarPlan (Paciente): Debería borrar un plan propio', async () => {
            mockedFetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

            await api.eliminarPlan('plan-123');

            expect(mockedFetch).toHaveBeenCalledWith(
                expect.stringContaining('/planes/plan-123'),
                expect.objectContaining({ method: 'DELETE' })
            );
        });

        it('eliminarPlan (Nutricionista): Debería incluir el ID del paciente como query param', async () => {
            mockedFetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

            await api.eliminarPlan('plan-1', 'user-2');

            expect(mockedFetch).toHaveBeenCalledWith(
                expect.stringContaining('/planes/plan-1?pacienteId=user-2'),
                expect.objectContaining({ method: 'DELETE' })
            );
        });
    });

    describe('Funciones de Nutricionista', () => {
        it('getPacientes: Debería obtener la lista de pacientes', async () => {
            mockedFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

            await api.getPacientes();

            expect(mockedFetch).toHaveBeenCalledWith(
                expect.stringContaining('/nutricionista/pacientes'),
                expect.anything()
            );
        });

        it('getAllPlanes: Debería obtener la vista global de planes', async () => {
            mockedFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

            await api.getAllPlanes();

            expect(mockedFetch).toHaveBeenCalledWith(
                expect.stringContaining('/nutricionista/todos-los-planes'),
                expect.anything()
            );
        });
    });

    describe('Servicios Externos', () => {
        it('getFarmacias: Debería conectar con el servicio configurado', async () => {
            mockedFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => [{ local_nombre: 'Farmacia Test' }]
            });

            await api.getFarmacias();

            expect(mockedFetch).toHaveBeenCalledWith(
                expect.stringContaining('/farmacias'),
                expect.anything()
            );
        });
    });

    describe('Manejo de Errores', () => {
        it('Debería lanzar una excepción descriptiva si el backend falla (500)', async () => {
            mockedFetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
                statusText: 'Internal Server Error',
                json: async () => ({ message: 'Error simulado en base de datos' })
            });

            await expect(api.getPerfil()).rejects.toThrow('Error simulado en base de datos');
        });

        it('Debería lanzar error genérico si la respuesta no es JSON', async () => {
            mockedFetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
                statusText: 'Not Found',
                json: async () => { throw new Error('No es JSON'); }
            });

            await expect(api.getPerfil()).rejects.toThrow('Error 404: Not Found');
        });
    });
});