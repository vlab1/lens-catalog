import LensesModel from '@/resources/lenses/lenses.model';
import Lenses from '@/resources/lenses/lenses.interface';
import { Schema } from 'mongoose';
import Props from '@/utils/types/props.type';
//import { promises as fs } from 'fs';
import * as fs from 'fs';
class LensesService {
    private lenses = LensesModel;

    private randGen(length: number) {
        const abc: string =
            'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let name: string = '';
        while (name.length < length) {
            name += abc[Math.floor(Math.random() * abc.length)];
        }
        return name;
    }

    private getNameVariable(
        variable: string,
        fileName: string,
        fileExtension: string
    ) {
        const query = fileName.split('.' + fileExtension)[0];

        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == variable) {
                return decodeURIComponent(pair[1]);
            }
        }
        console.log('Query variable %s not found', variable);
    }

    private getFileExtension(filename: string) {
        var ext = /^.+\.([^.]+)$/.exec(filename);
        return ext == null ? '' : ext[1];
    }

    public async create(
        manufacturer: string,
        country: string,
        material: string,
        coating: string,
        description: string,
        images: Express.Multer.File[],
        name: string,
        type: string
    ): Promise<Lenses | Error> {
        try {
            const fileNames = [] as Array<string>;
            if (images && images.length > 10) {
                throw new Error('Maximum number of files 10');
            }
            if (images && images.length > 0) {
                for (let i = 0; i < images.length; i++) {
                    if (images[i].buffer.length > 10000000) {
                        throw new Error('Maximum file size 10 MB');
                    }
                    if (images[i].originalname.indexOf('color') < 0) {
                        throw new Error(
                            'Color must be included in the title of the image.'
                        );
                    }
                }
                await Promise.all(
                    images.map((item, index) => {
                        const fileExtension = this.getFileExtension(
                            item.originalname
                        );
                        const color = this.getNameVariable(
                            'color',
                            item.originalname,
                            fileExtension
                        );
                        const randString = this.randGen(24);
                        const fileName =
                            randString +
                            '_' +
                            color +
                            '_' +
                            Date.now() +
                            '_' +
                            `${new Date().toISOString().slice(0, 10)}` +
                            '.' +
                            fileExtension;
                        if (!fs.existsSync(`./src/images`)) {
                            fs.mkdirSync(`./src/images`);
                        }
                        if (
                            !fs.existsSync(
                                `./src/images/${new Date()
                                    .toISOString()
                                    .slice(0, 10)}`
                            )
                        ) {
                            fs.mkdirSync(
                                `./src/images/${new Date()
                                    .toISOString()
                                    .slice(0, 10)}`
                            );
                        }
                        fs.promises.writeFile(
                            `./src/images/${new Date()
                                .toISOString()
                                .slice(0, 10)}/${fileName}`,
                            item.buffer,
                            'binary'
                        );
                        fileNames.push(fileName);
                    })
                );
            }
            const lenses = await this.lenses.create({
                manufacturer,
                country,
                material,
                coating,
                description,
                images: fileNames,
                name,
                type,
            });
            return lenses;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async update(
        _id: Schema.Types.ObjectId,
        manufacturer: string,
        country: string,
        material: string,
        coating: string,
        description: string,
        images: Express.Multer.File[],
        name: string,
        type: string,
        prevImages: Array<string>
    ): Promise<Lenses | Error> {
        try {
            const lensesTemp = await this.lenses.findById(_id);
            if (!lensesTemp) {
                throw new Error('Unable to find lenses');
            }
            if (!images) {
                prevImages = lensesTemp.images;
            }
            if (images && images.length + prevImages.length > 10) {
                throw new Error('Maximum number of files 10');
            }
            if (images && images.length > 0) {
                for (let i = 0; i < images.length; i++) {
                    if (images[i].buffer.length > 10000000) {
                        throw new Error('Maximum file size 10 MB');
                    }
                }
                await Promise.all(
                    images.map((item, index) => {
                        const fileExtension = this.getFileExtension(
                            item.originalname
                        );
                        const color = this.getNameVariable(
                            'color',
                            item.originalname,
                            fileExtension
                        );
                        const randString = this.randGen(24);
                        const fileName =
                            randString +
                            '_' +
                            color +
                            '_' +
                            Date.now() +
                            '_' +
                            `${new Date().toISOString().slice(0, 10)}` +
                            '.' +
                            fileExtension;
                        if (!fs.existsSync(`./src/images`)) {
                            fs.mkdirSync(`./src/images`);
                        }
                        if (
                            !fs.existsSync(
                                `./src/images/${new Date()
                                    .toISOString()
                                    .slice(0, 10)}`
                            )
                        ) {
                            fs.mkdirSync(
                                `./src/images/${new Date()
                                    .toISOString()
                                    .slice(0, 10)}`
                            );
                        }
                        fs.promises.writeFile(
                            `./src/images/${new Date()
                                .toISOString()
                                .slice(0, 10)}/${fileName}`,
                            item.buffer,
                            'binary'
                        );
                        prevImages.push(fileName);
                    })
                );
            }

            const lenses = await this.lenses.findByIdAndUpdate(
                _id,
                {
                    manufacturer,
                    country,
                    material,
                    coating,
                    description,
                    images: prevImages,
                    name,
                    type,
                },
                { new: true }
            );

            if (!lenses) {
                throw new Error('Unable to update lenses with thad data');
            }
            return lenses;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async delete(_id: Schema.Types.ObjectId): Promise<Lenses | Error> {
        try {
            let lenses = (await this.lenses.findById(_id)) as Lenses;

            if (!lenses) {
                throw new Error('Unable to find lenses with that data');
            }

            lenses.images.map((item) => {
                fs.unlink(
                    `./src/images/${item.split('_')[3].split('.')[0]}/${item}`,
                    function (err) {
                        if (err) {
                            return console.log(err);
                        }
                    }
                );
            });

            const removedLenses = await this.lenses.findByIdAndDelete(_id);

            if (!removedLenses) {
                throw new Error('Unable to delete lenses with that data');
            }
            return removedLenses;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async deleteImage(
        _id: Schema.Types.ObjectId,
        url: string
    ): Promise<Lenses | Error> {
        try {
            let lenses = (await this.lenses.findById(_id)) as Lenses;

            if (!lenses) {
                throw new Error('Unable to find lenses with that data');
            }
            if (lenses.images.includes(url)) {
                lenses = (await this.lenses.findByIdAndUpdate(
                    _id,
                    { $pullAll: { images: [url] } },
                    { new: true }
                )) as Lenses;
                fs.unlink(
                    `./src/images/${url.split('_')[3].split('.')[0]}/${url}`,
                    function (err) {
                        if (err) {
                            return console.log(err);
                        }
                    }
                );
            }
            return lenses;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async find(props: Props): Promise<Lenses | Array<Lenses> | Error> {
        try {
            const lenses = await this.lenses.find(props, null, {
                sort: { createdAt: -1 },
            });
            if (!lenses) {
                throw new Error('Unable to find lenses with that data');
            }
            const b = [] as any;

            return lenses;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default LensesService;
