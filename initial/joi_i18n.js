import path from 'path';
import Joi from 'joi';
import joi18nz from 'joi18nz';

export default joi18nz(Joi, path.join(__dirname, '/config/locale'));
