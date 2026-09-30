import { Request, Response } from "express";
import { ApiResponse } from "@/common/utils/ApiResponse";
import { BadRequestError } from "@/common/errors/AppError";
import * as service from "@/modules/services/services.service";

export const categories = {
  list: async (_req: Request, res: Response) =>
    ApiResponse.success(res, await service.listCategories(), "Categories fetched"),
  create: async (req: Request, res: Response) =>
    ApiResponse.created(res, await service.createCategory(req.body, req.user!.sub), "Category created"),
  update: async (req: Request, res: Response) =>
    ApiResponse.success(res, await service.updateCategory(req.params.id, req.body, req.user!.sub), "Category updated"),
  delete: async (req: Request, res: Response) =>
    ApiResponse.success(res, await service.deleteCategory(req.params.id, req.user!.sub), "Category deleted"),
  uploadTemplate: async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) {
      throw new BadRequestError("No template PDF file provided");
    }
    const { processCategoryTemplateUpload } = await import("@/modules/proposals/template-processor.service");
    const result = await processCategoryTemplateUpload({
      categoryId: req.params.id,
      fileBuffer: file.buffer,
      fileName: file.originalname,
      customHtml: req.body.templateHtml,
    });
    const updated = await service.updateCategoryTemplate(
      req.params.id,
      {
        templatePdfUrl: result.templatePdfUrl,
        templateHtml: result.templateHtml,
        bgImageUrls: [result.compressedBgUrl],
      },
      req.user!.sub
    );
    return ApiResponse.success(res, updated, "Category proposal PDF template uploaded & compressed via Cloudinary");
  },
};

export const packages = {
  list: async (req: Request, res: Response) =>
    ApiResponse.success(
      res,
      await service.listPackages(req.query.categoryId as string | undefined, req.query.search as string | undefined),
      "Packages fetched",
    ),
  getById: async (req: Request, res: Response) =>
    ApiResponse.success(res, await service.getPackageById(req.params.id), "Package fetched"),
  create: async (req: Request, res: Response) =>
    ApiResponse.created(res, await service.createPackage(req.body, req.user!.sub), "Package created"),
  update: async (req: Request, res: Response) =>
    ApiResponse.success(res, await service.updatePackage(req.params.id, req.body, req.user!.sub), "Package updated"),
  delete: async (req: Request, res: Response) =>
    ApiResponse.success(res, await service.deletePackage(req.params.id, req.user!.sub), "Package deleted"),
};

export const addons = {
  list: async (req: Request, res: Response) =>
    ApiResponse.success(
      res,
      await service.listAddons(req.query.categoryId as string | undefined, req.query.search as string | undefined),
      "Add-ons fetched",
    ),
  create: async (req: Request, res: Response) =>
    ApiResponse.created(res, await service.createAddon(req.body, req.user!.sub), "Add-on created"),
  update: async (req: Request, res: Response) =>
    ApiResponse.success(res, await service.updateAddon(req.params.id, req.body, req.user!.sub), "Add-on updated"),
  delete: async (req: Request, res: Response) =>
    ApiResponse.success(res, await service.deleteAddon(req.params.id, req.user!.sub), "Add-on deleted"),
};
