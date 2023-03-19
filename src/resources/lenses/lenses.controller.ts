import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/lenses/lenses.validation';
import LensesService from '@/resources/lenses/lenses.service';
import authenticated from '@/middleware/authenticated.middleware';
import Props from '@/utils/types/props.type';
const multer = require('multer');
const memoStorage = multer.memoryStorage();
const upload = multer({ memoStorage });
class LensesController implements Controller {
    public path = '/lenses';
    public router = Router();
    private LensesService = new LensesService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}/create`,
            upload.array('pic'),
            validationMiddleware(validate.create),
            //authenticated,
            this.create
        );
        this.router.put(
            `${this.path}/update`,
            upload.array('pic'),
            validationMiddleware(validate.update),
            authenticated,
            this.update
        );
        this.router.delete(
            `${this.path}/delete`,
            validationMiddleware(validate.delete0),
            authenticated,
            this.delete
        );
        this.router.delete(
            `${this.path}/image/delete`,
            validationMiddleware(validate.imageDelete),
            authenticated,
            this.deleteImage
        );
        this.router.get(
            `${this.path}/find`,
            validationMiddleware(validate.find),
            this.find
        );
    }

     private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const {
                manufacturer,
                country,
                material,
                coating,
                description,
                images,
                name,
                type
            } = req.body;

            const lenses = await this.LensesService.create(
                manufacturer,
                country,
                material,
                coating,
                description,
                images,
                name,
                type
            );

            res.status(201).json({ data: lenses });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private update = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const {
                _id,
                manufacturer,
                country,
                material,
                coating,
                description,
                images,
                name,
                type,
                prevImages
            } = req.body;

            const lenses = await this.LensesService.update(
                _id,
                manufacturer,
                country,
                material,
                coating,
                description,
                images,
                name,
                type,
                prevImages
            );

            res.status(201).json({ data: lenses });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private delete = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { _id } = req.body;
            const lenses = await this.LensesService.delete(_id);

            res.status(201).json({ data: lenses });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private deleteImage = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { _id, url } = req.body;

            const lenses = await this.LensesService.deleteImage(_id, url);

            res.status(201).json({ data: lenses });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private find = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const props = req.body as Props;

            const lenses = await this.LensesService.find(props);

            res.status(201).json({ data: lenses });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

}

export default LensesController;
