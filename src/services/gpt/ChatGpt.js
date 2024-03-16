// const OpenAI = require("openai");
const configs = require("../../../configs");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: configs.chatGPTKey, // This is the default and can be omitted
});

const GPTConnector = {
  initialize() {
    // const configuration = new Configuration({
    //   apiKey: configs.chatGPTKey,
    // });
    this.openai = openai;
  },

  async askGPT(prompt) {
    try {
      const response = await this.openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
      });

      console.log(JSON.stringify(response));
      const info = response.choices[0].message.content;

      return info;
    } catch (error) {
      console.error("Error calling the OpenAI API:", error);
    }
  },

  async convertPolicyToRelationalArgument(policyStatement) {
    return this.askGPT(
      "Give me a relational algebric expression of all the requirement for this plicy to be applicable?\n" +
        policyStatement
    );
  },
};

GPTConnector.initialize();

module.exports = GPTConnector;
