import type { BuyerFormValues, SellerFormValues } from "@/lib/validations/onboarding";

export function buildSellerFormData(data: SellerFormValues): FormData {
  const formData = new FormData();
  formData.set("category", data.category);
  if (data.repositoryLink) formData.set("repositoryLink", data.repositoryLink);
  if (data.mrr) formData.set("mrr", data.mrr);
  if (data.techStack) formData.set("techStack", data.techStack);
  if (data.assetUrl) formData.set("assetUrl", data.assetUrl);
  if (data.avgWatchTime) formData.set("avgWatchTime", data.avgWatchTime);
  if (data.monthlyTraffic) formData.set("monthlyTraffic", data.monthlyTraffic);
  if (data.monthlyRevenue) formData.set("monthlyRevenue", data.monthlyRevenue);
  data.fileNames?.forEach((name) => formData.append("fileNames", name));
  return formData;
}

export function buildBuyerFormData(data: BuyerFormValues): FormData {
  const formData = new FormData();
  formData.set("budgetRange", data.budgetRange);
  data.categoriesOfInterest.forEach((category) => formData.append("categoriesOfInterest", category));
  return formData;
}
