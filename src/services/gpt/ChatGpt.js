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
      // console.log(`prompt : ${prompt}`);
      const response = await this.openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
      });
      const info = response.choices[0].message.content;
      // console.log(`reply : ${info}`);
      return info;
    } catch (error) {
      console.error("Error calling the OpenAI API:", error);
    }
  },

  async convertPolicyToRelationalExpression(policyStatement) {
    return this.askGPT(
      "Give me a relational algebric expression of all the requirement for this plicy to be applicable?\n" +
        policyStatement
    );
  },

  async fillFormForPatient(emptyPAFormTxt, EHRInfo) {
    return this.askGPT(
      `Fill this form for me ${emptyPAFormTxt} here are the details ${EHRInfo} `
    );
  },

  async isPolicyApplicable(filledPAFormTxt, policyRelationalAlgebra) {
    return this.askGPT(
      `Is the provided policy\n${policyRelationalAlgebra}\n applicable to the person with these details ${filledPAFormTxt}`
    );
  },
};

GPTConnector.initialize();

module.exports = GPTConnector;
