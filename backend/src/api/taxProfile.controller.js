import { saveTaxProfile, getTaxProfile } from "../domain/kyc/taxProfileRepo.js";

/**
 * GET /api/tax/profile/:userAddress
 * 获取用户的税务档案
 */
export async function getTaxProfileHandler(req, res) {
  try {
    const { userAddress } = req.params;
    
    if (!userAddress) {
      return res.status(400).json({
        success: false,
        error: "userAddress is required"
      });
    }

    const profile = getTaxProfile(userAddress);

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: "Tax profile not found"
      });
    }

    res.json({
      success: true,
      profile
    });
  } catch (err) {
    console.error(">>> Error in getTaxProfileHandler:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

/**
 * POST /api/tax/profile
 * 保存或更新用户的税务档案
 */
export async function saveTaxProfileHandler(req, res) {
  try {
    const { userAddress, country, taxResidency, taxYear, name, filingStatus } = req.body;
    
    if (!userAddress) {
      return res.status(400).json({
        success: false,
        error: "userAddress is required"
      });
    }

    const profile = {
      userAddress,
      country: country || taxResidency || "SG",
      taxResidency: taxResidency || country || "SG",
      taxYear: taxYear || "2024",
      name: name || "",
      filingStatus: filingStatus || "individual",
      updatedAt: new Date().toISOString()
    };

    saveTaxProfile(profile);

    res.json({
      success: true,
      profile
    });
  } catch (err) {
    console.error(">>> Error in saveTaxProfileHandler:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
