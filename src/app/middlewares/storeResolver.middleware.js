import { CompanyStore } from "../modules/companyStore/companyStore.model.js";

export const storeResolver = async (req, res, next) => {
  try {
    const rawHost =
      req.headers["x-store-domain"] ||
      req.headers["x-forwarded-host"] ||
      req.headers.host ||
      "";

    if (!rawHost) {
      return res.status(400).json({
        success: false,
        message: "Store domain not found",
      });
    }

    let domain = rawHost.toString().toLowerCase().trim();

    // ✅ আগে check করো full URL কিনা (http:// বা https:// দিয়ে শুরু)
    if (domain.startsWith("http://") || domain.startsWith("https://")) {
      try {
        domain = new URL(domain).hostname; // সরাসরি parse করো, "http://" যোগ করো না
      } catch (err) {
        // invalid হলে যা আছে তাই রাখো
      }
    } else {
      // plain domain বা domain:port — http:// যোগ করে parse করো
      try {
        domain = new URL("http://" + domain).hostname;
      } catch (err) {}
    }

    // ✅ www. সরাও
    domain = domain.replace(/^www\./, "").trim();

    // ✅ port সরাও যদি থাকে (localhost:3000 এর ক্ষেত্রে)
    domain = domain.split(":")[0];

    if (!domain) {
      return res.status(400).json({
        success: false,
        message: "Invalid domain",
      });
    }

    const store = await CompanyStore.findOne({ domain }).lean();

    if (!store) {
      return res.status(404).json({
        success: false,
        message: `No store found for domain: ${domain}`,
      });
    }

    req.store = store;
    req.storeId = store._id;

    next();
  } catch (err) {
    next(err);
  }
};