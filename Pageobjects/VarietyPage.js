const path = require('path');
const { BaseActions } = require('../utils/BaseActions');

class VarietyPage extends BaseActions {
  constructor(page) {
    super(page);
    
    this.selectors = {
      fileInput: "#uploadImage",
      cropTypeDropdown: "#cropType",
      companyNameDropdown: "#selectCompanyName",
      NameInput: "#cropName",
      graftingToggle: "#usedInGraftingToggle",
      maturityDaysInput: "#maturityDays",
      germinationRateInput: "#germinationRate",
      germinationDaysInput: "#germinationDays",
      yieldInput: "#cropYield",
      seedTreatmentDropdown: "#seedTreatment-trigger",
      diseaseResistanceInput: "#diseaseResistance",
      weightUnitDropdown: "#selectPackingType",
      packagingSizeInput: "#packingSize",
      packagingTypeDropdown: "#packingType-trigger",
      seedsPerPacketInput: "#seedsPerPack",
      seedSpacingInput: "#seedSpacing",
      seedSpacingUnitDropdown: "#selectSpacingUnit",
      sowingDepthInput: "#sowingDepth",
      sowingDepthUnitDropdown: "#selectDepthUnit",
      rowSpacingInput: "#rowSpacing",
      rowSpacingUnitDropdown: "#selectRowSpacingUnit",
      restrictionsInput: "#restrictions",
      usageInstructionsInput: "#usageInstructions"
    };
  }

  async navigateToVariety() {
    await this.page.getByRole('link', { name: 'Crops Crops' }).click();
    await this.page.getByRole('link', { name: 'Variety', exact: true }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async createOrEditOrViewVariety(data, mode = 'create') {
    // Handle image upload (only for create mode)
    if (mode !== 'view' && data.imagePath) {
      const fileInput = this.page.locator(this.selectors.fileInput);
      const fullPath = path.resolve(data.imagePath);
      await fileInput.setInputFiles(fullPath);
      await this.page.waitForTimeout(1000);
    }

    // Crop Type - only for create mode
    if (mode === 'create') {
      await this.page.locator(this.selectors.cropTypeDropdown).click();
      await this.page.getByText(data.cropType, { exact: true }).click();
      await this.page.waitForTimeout(500);
    }

    // Company Name - skip in view mode as it's displayed as static text
    if (mode !== 'view') {
      await this.selectOrVerifyDropdownByXPath(
        this.selectors.companyNameDropdown,
        data.companyName,
        mode
      );
    }

    // Crop Name
    await this.fillOrVerify(
      this.page.locator(this.selectors.NameInput),
      data.Name,
      mode
    );

    // Grafting toggle - only for create mode
    if (mode === 'create') {
      await this.page.locator(this.selectors.graftingToggle).click();
      await this.page.waitForTimeout(500);
    }

    // Maturity Days
    await this.fillOrVerify(
      this.page.locator(this.selectors.maturityDaysInput),
      data.numberOfDays1,
      mode
    );

    // Germination Rate 
    await this.fillOrVerify(
      this.page.locator(this.selectors.germinationRateInput),
      data.ratePercentage,
      mode
    );

    // Germination Days 
    await this.fillOrVerify(
      this.page.locator(this.selectors.germinationDaysInput),
      data.numberOfDays2,
      mode
    );

    // Yield 
    await this.fillOrVerify(
      this.page.locator(this.selectors.yieldInput),
      data.yield,
      mode
    );

    // Seed Treatment - skip in view mode
    if (mode !== 'view') {
      await this.selectOrVerifyDropdownByXPath(
        this.selectors.seedTreatmentDropdown,
        data.treatment,
        mode
      );
    }

    // Disease Resistance 
    if (mode === 'create' || mode === 'edit') {
      const diseases = Array.isArray(data.diseases) ? data.diseases : [data.diseases];
      await this.addTags(this.selectors.diseaseResistanceInput, diseases);
    } else if (mode === 'view') {
      // In view mode, just verify the tags exist
      const diseases = Array.isArray(data.diseases) ? data.diseases : [data.diseases];
      for (const disease of diseases) {
        await this.verifyTagExists(disease);
      }
    }

    // Weight Unit dropdown - skip in view mode
    if (mode !== 'view') {
      await this.selectOrVerifyDropdownByXPath(
        this.selectors.weightUnitDropdown,
        data.weightUnit,
        mode
      );
    }

    // Packaging Size
    await this.fillOrVerify(
      this.page.locator(this.selectors.packagingSizeInput),
      data.packagingSize,
      mode
    );

    // Packaging Type - skip in view mode
    if (mode !== 'view') {
      await this.selectOrVerifyDropdownByXPath(
        this.selectors.packagingTypeDropdown,
        data.packagingUnit,
        mode
      );
    }

    // Number of Seeds per Packet 
    await this.fillOrVerify(
      this.page.locator(this.selectors.seedsPerPacketInput),
      data.numberOfDays3,
      mode
    );

    // Seed Spacing 
    await this.fillOrVerify(
      this.page.locator(this.selectors.seedSpacingInput),
      data.spacingValue1,
      mode
    );

    // Spacing Unit - skip in view mode
    if (mode !== 'view') {
      await this.selectOrVerifyDropdownByXPath(
        this.selectors.seedSpacingUnitDropdown,
        data.spacingUnit1,
        mode
      );
    }

    // Sowing Depth
    await this.fillOrVerify(
      this.page.locator(this.selectors.sowingDepthInput),
      data.spacingValue2,
      mode
    );

    // Depth Unit - skip in view mode
    if (mode !== 'view') {
      await this.selectOrVerifyDropdownByXPath(
        this.selectors.sowingDepthUnitDropdown,
        data.spacingUnit2,
        mode
      );
    }

    // Row Spacing 
    await this.fillOrVerify(
      this.page.locator(this.selectors.rowSpacingInput),
      data.spacingValue3,
      mode
    );

    // Row Spacing Unit - skip in view mode
    if (mode !== 'view') {
      await this.selectOrVerifyDropdownByXPath(
        this.selectors.rowSpacingUnitDropdown,
        data.spacingUnit3,
        mode
      );
    }

    // Restrictions / Compatibility 
    await this.fillOrVerify(
      this.page.locator(this.selectors.restrictionsInput),
      data.information1,
      mode
    );

    // Usage Instructions 
    await this.fillOrVerify(
      this.page.locator(this.selectors.usageInstructionsInput),
      data.information2,
      mode
    );

    this.submitorUpdateVariety(data, mode);
   
  }

  async submitorUpdateVariety(data, mode='create') {
    if (mode === 'create') {
      await this.clickButtonByText(data.saveButtonLabel);
      await this.page.waitForLoadState('networkidle');
      
    } else if (mode === 'edit') {
      await this.clickButtonByText(data.updateButtonLabel);
      
    }
  }

  async testCase1(data) {
    const languages = ['Hindi', 'Tamil'];
    for (const lang of languages) {
      if (lang !== data.language) {
        await this.switchLanguage(lang);
        await this.verifyRowVisible(data.Name);
        await this.switchLanguage('English');
        await this.clickButtonByText(data.addButtonLabel);
        await this.selectDropdownOption(data.language, lang);
        await this.checkerrorMessage(
          "//*[@id='root']/div/div[2]/div[2]/div/div[1]/div[1]/div[2]/span",
          `Please create for English first`
        );
        await this.back();
      }
    }
  }

  async findduplicateEntryError(data) {
    await this.createOrEditOrViewVariety(data, 'create');
    await this.checkerrorMessage(
      "#selectEngFirst",
      `must be unique per language`);
    await this.back();
    await this.fillOrVerify(
      this.page.locator(this.selectors.NameInput),
      data.Name+'1',
      mode="create"
    );
    this.submitorUpdateVariety(data, mode='create');
    await this.verifyRowVisible(data.Name+'1');
    
  }

  async createVariety(data) {
    await this.clickButtonByText(data.addButtonLabel);
    await this.createOrEditOrViewVariety(data, 'create');
    await this.page.getByRole('button', { name: 'Sort' }).click();
    await this.page.getByRole('menuitem', { name: 'Last Updated' }).click();
    await this.verifyRowVisible(data.Name);
  }

  async viewVarietyDetails(data) {
    await this.viewRow(data.Name);
    await this.page.waitForLoadState('networkidle');
    await this.createOrEditOrViewVariety(data, 'view');
    await this.back();
  }

  async editVariety(currentName, editData) {
    await this.editRow(currentName);
    await this.page.waitForLoadState('networkidle');
    await this.createOrEditOrViewVariety(editData, 'edit');
    await this.page.getByRole('button', { name: 'Sort' }).click();
    await this.page.getByRole('menuitem', { name: 'Last Updated' }).click();
    await this.page.waitForTimeout(1000);
    await this.verifyRowVisible(editData.Name);
  }

  async updateVarietyInLanguage(currentName, data) {
    await this.editRow(currentName);
    await this.page.waitForLoadState('networkidle');
    await this.selectDropdownOption('English', data.language);
    await this.page.waitForTimeout(500);
    await this.createOrEditOrViewVariety(data, 'edit');
    await this.switchLanguage(data.language);
    if (data.language === 'Hindi') {
      await this.page.getByRole('button', { name: 'क्रमबद्ध करें' }).click();
      await this.page.getByRole('menuitem', { name: 'अंतिम अपडेट' }).click();
    }
    else{
      await this.page.getByRole('button', { name: 'வடிகட்டிகள்' }).click();
      await this.page.getByRole('menuitem', { name: 'இறுதி புதுப்பிப்பு' }).click();
    }
    await this.page.waitForTimeout(1000);
    await this.verifyRowVisible(data.Name);
    await this.switchLanguage('English');
    
  }
}

module.exports = { VarietyPage };