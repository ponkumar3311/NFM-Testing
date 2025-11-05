const { BaseActions } = require('../utils/BaseActions');

class GrowthStagePage extends BaseActions {
  constructor(page) {
    super(page);

    this.selectors = {
      
       NameInput: "//*[@id='stageName']",
       DescriptionInput: "//*[@id='description']",

     };
  }
 async testCase1(data) {
  const languages = ['Hindi', 'Tamil'];
  for (const lang of languages) {
    if (lang !== data.language){
      await this.switchLanguage(lang);
    await this.verifyRowVisible(data.Name);
    await this.switchLanguage('English');
    await this.clickButtonByText(data.addButtonLabel);
    await this.selectDropdownOption(data.language, lang);
    await this.checkerrorMessage(
      "//*[@id='root']/div/div[2]/div[2]/div/div[1]/div[2]/span",
      `Please create for English first`);
    await this.back();
    
  }
}
 }

  async navigateToGrowthStage() {
    await this.page.getByRole('link', { name: 'Crops Crops' }).click();
    await this.page.getByRole('link', { name: 'Growth Stage' }).click();
  }
 
   async createOrEditOrViewVariety(data, mode = 'create') {
     await this.fillOrVerify(
       this.page.locator(this.selectors.NameInput),
       data.Name,
       mode
     );
     await this.fillOrVerify(
       this.page.locator(this.selectors.DescriptionInput),
       data.description,
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

   async findduplicateEntryError(data,mode,currentName='TESTduplicate') {
    const dupname = data.Name+'duplicate';

    if(mode==='create'){
    await this.clickButtonByText(data.addButtonLabel);
    await this.createOrEditOrViewVariety(data, mode);
    await this.checkdupmsg(data.duplicateMsg, data.duplicateMsgButton);
     await this.fillOrVerify(this.page.locator(this.selectors.NameInput),dupname,mode);
     this.submitorUpdateVariety(data, mode);
      await this.verifyRowVisible(dupname);
    }
    else{
      await this.editRow(currentName);
      await this.page.waitForLoadState('networkidle');
       await this.selectDropdownOption('English', data.language);
       await this.fillOrVerify(this.page.locator(this.selectors.NameInput),data.Name,mode);
       this.submitorUpdateVariety(data, mode);
       await this.page.waitForTimeout(500);
       await this.checkdupmsg(data.duplicateMsg, data.duplicateMsgButton);
        await this.fillOrVerify(this.page.locator(this.selectors.NameInput),dupname,mode);
        await this.page.waitForTimeout(500);
        this.submitorUpdateVariety(data, mode);
        await this.switchLanguage('English');
   };
  }

  async findduplicatemessage(editEnglish,editHindi,editTamil){
    await this.findduplicateEntryError(editEnglish, 'create');
    await this.findduplicateEntryError(editHindi, 'edit',editEnglish.Name+'duplicate');
    await this.findduplicateEntryError(editTamil, 'edit',editEnglish.Name+'duplicate');
  }


   async create(data) {
     await this.clickButtonByText(data.addButtonLabel);
     await this.createOrEditOrViewVariety(data, 'create');
     await this.page.getByRole('button', { name: 'Sort' }).click();
     await this.page.getByRole('menuitem', { name: 'Last Updated' }).click();
     await this.verifyRowVisible(data.Name);
   }
 
   async view(data) {
     await this.viewRow(data.Name);
     await this.page.waitForLoadState('networkidle');
     await this.createOrEditOrViewVariety(data, 'view');
     await this.back();
   }
 
   async edit(currentName, editData) {
     await this.editRow(currentName);
     await this.page.waitForLoadState('networkidle');
     await this.createOrEditOrViewVariety(editData, 'edit');
      await this.page.getByRole('button', { name: 'Sort' }).click();
      await this.page.getByRole('menuitem', { name: 'Last Updated' }).click();
      await this.page.waitForTimeout(1000);
       await this.verifyRowVisible(editData.Name);
   }
 
   async updateInLanguage(currentName, data) {
     await this.editRow(currentName);
     await this.page.waitForLoadState('networkidle');
       await this.selectDropdownOption('English', data.language);
       await this.page.waitForTimeout(500);
       await this.createOrEditOrViewVariety(data, 'edit');
       await this.page.waitForTimeout(1000);
       await this.switchLanguage(data.language);
       if (data.language === 'Hindi') {
       await this.page.getByRole('button', { name: 'क्रमबद्ध करें' }).click();
       await this.page.getByRole('menuitem', { name: 'अंतिम अपडेट' }).click();
       }
       else{
       await this.page.getByRole('button', { name: 'வரிசைப்படுத்து' }).click();
       await this.page.getByRole('menuitem', { name: 'இறுதி புதுப்பிப்பு' }).click();
       }
       await this.page.waitForTimeout(1000);
       await this.verifyRowVisible(data.Name);
       await this.switchLanguage('English');
     
   }
}

module.exports = { GrowthStagePage };
