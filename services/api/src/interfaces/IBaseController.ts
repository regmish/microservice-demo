import { Router } from "express";

/**
 * @abstract class BaseController
 */
export abstract class BaseController {
    abstract routes(): Router;
}