import type { BuyerFormValues, SellerFormValues } from "@/lib/validations/onboarding";

export function buildSellerFormData(data: SellerFormValues): FormData {
  const formData = new FormData();
  formData.set("category", data.category);
  formData.set("contactInfo", data.contactInfo);
  if (data.repositoryLink) formData.set("repositoryLink", data.repositoryLink);
  if (data.mrr) formData.set("mrr", data.mrr);
  if (data.techStack) formData.set("techStack", data.techStack);
  if (data.assetUrl) formData.set("assetUrl", data.assetUrl);
  if (data.avgWatchTime) formData.set("avgWatchTime", data.avgWatchTime);
  if (data.monthlyTraffic) formData.set("monthlyTraffic", data.monthlyTraffic);
  if (data.monthlyRevenue) formData.set("monthlyRevenue", data.monthlyRevenue);
  if (data.platformName) formData.set("platformName", data.platformName);
  if (data.subscriberCount) formData.set("subscriberCount", data.subscriberCount);
  if (data.openRate) formData.set("openRate", data.openRate);
  if (data.niche) formData.set("niche", data.niche);
  if (data.storeName) formData.set("storeName", data.storeName);
  if (data.skuCount) formData.set("skuCount", data.skuCount);
  if (data.reasonForSelling) formData.set("reasonForSelling", data.reasonForSelling);
  data.fileNames?.forEach((name) => formData.append("fileNames", name));
  return formData;
}

export function buildBuyerFormData(data: BuyerFormValues): FormData {
  const formData = new FormData();
  formData.set("budgetRange", data.budgetRange);
  formData.set("contactInfo", data.contactInfo);
  data.categoriesOfInterest.forEach((category) => formData.append("categoriesOfInterest", category));
  return formData;
}
