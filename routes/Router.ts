import express, {Router, Request, Response} from 'express';
const router = Router();

router.get('/test', (req: Request, res: Response) => {
    res.send('Teste do route')
})

router.get('/*', (req: Request, res: Response) => {
    res.send('Rota não encontrada.')
})

export default router;