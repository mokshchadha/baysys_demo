const configs = require("../../../configs");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: configs.chatGPTKey,
});

const GPTConnector = {
  initialize() {
    this.openai = openai;
  },

  async askGPT(prompt) {
    try {
      const response = await this.openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
      });
      const info = response.choices[0].message.content;
      return info;
    } catch (error) {
      console.error("Error calling the OpenAI API:", error);
    }
  },

  async convertPolicyToRelationalExpression(policyStatement, json = null) {
    if (json)
      return this.askGPT(
        `Give me a algebric expression of all the requirement for this policy to be applicable using logical operators and variables?\n` +
          `using the json ${json} and corresponding policy details being ${policyStatement}`
      );
    return this.askGPT(
      "Give me a algebric expression of all the requirement for this policy to be applicable using logical operators and variables?\n " +
        policyStatement
    );
  },

  async fillFormForPatient(emptyPAFormTxt, EHRInfo) {
    return this.askGPT(
      `Fill this form for me ${emptyPAFormTxt} here are the details ${EHRInfo} `
    );
  },

  async convertPolicyDataToJson(policyStatementText) {
    // const idealFormat = {
    //   criteria_number: "",
    //   criteria_description: "",
    //   requirements: {},
    // };
    // const mappingTxt = await this.askGPT(
    //   `Given the policy statement as ${policyStatementText},` +
    //     `give me a non-nested JSON object with all the attributes ` +
    //     `for creteria required for evaluation of the policy that can be filled in the format of a form` +
    //     `for the json you can follow this formatting` +
    //     ` ${JSON.stringify(idealFormat)}`
    // );
    // const mapping = JSON.parse(mappingTxt);
    // return mapping;
  },

  async convertPAFormDataToJSON(paFormText) {
    const idealFormat = {
      PatientInformation: {
        FirstName: "",
        LastName: "",
        DateOfBirth: "",
        IDNumber: "",
        Address: "",
      },
      ReferringPrescribingProvider: {
        Name: "",
        NPI: "",
        Phone: "",
        TypeOfProvider: "",
      },
      AnticipatedDateOfService: "",
      PlaceOfService: "",
      ICD10Codes: [""],
      CPT_HCPC_Codes: [""],
      Documentation: "",
    };

    const mappingTxt = await this.askGPT(
      `Given the policy statement as ${paFormText},` +
        `give me a non-nested JSON object with all the attributes ` +
        `for creteria required for evaluation of the policy that can be filled in the format of a form` +
        `for the json you use the format similar to` +
        ` ${JSON.stringify(idealFormat)}`
    );
    const mapping = JSON.parse(mappingTxt);
    return mapping;
  },

  async isPolicyApplicable(filledPAFormTxt, policyRelationalAlgebra) {
    return this.askGPT(
      `Evalulate and return results in json by comparing each part of the policy which ones are applicable which ones are not one by one,` +
        ` comparision should be text from the policy vs text from the person data applicable write TRUE or FALSE against each comparision ` +
        `given that the provided policy is \n${policyRelationalAlgebra}\n and person  details are ${filledPAFormTxt} `
    );
  },

  async isPolicyApplicableV2(
    stepByStepAnalysis,
    relationalAlgebra,
    additionalInfo
  ) {
    const jsontxt = await this.askGPT(
      `Evaluate in a json with 2 keys "status" and "reason" where status is a one wheather the policy is "approved", "denied", "requires more information" ` +
        `and reason is one line summary of why the status is approved, denied or requires info` +
        `where the comparision is ${stepByStepAnalysis} with additonal info:- ${additionalInfo} and approved creteria is ${relationalAlgebra}`
    );
    return JSON.parse(jsontxt);
  },

  async comparePersonPolicyAndForm(filledPAFormTxt, policyRelationalAlgebra) {
    return this.askGPT(
      `Do a step by step comparision of the users info\n ${filledPAFormTxt}\n against the policy requirements\n ${policyRelationalAlgebra}`
    );
  },
};

GPTConnector.initialize();

module.exports = GPTConnector;
