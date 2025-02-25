const generateDoubtPrompt = (language, expertise, doubt) => {
    let prompt = "";

    switch (expertise) {
        case "beginner":
            if (language === "hindi") {
                prompt = `"${doubt}" को एक सरल और सहज तरीके से समझाएँ ताकि एक शुरुआती व्यक्ति इसे आसानी से समझ सके। उत्तर को निम्नलिखित प्रारूप में प्रस्तुत करें:  

                1️⃣ **परिभाषा:**  
                - अवधारणा (concept) की एक छोटी और आसान परिभाषा दें।  

                2️⃣ **दैनिक जीवन से उदाहरण:**  
                - इसे समझाने के लिए रोजमर्रा की जिंदगी से कोई सरल तुलना करें।  

                3️⃣ **उदाहरण:**  
                - एक आसान उदाहरण दें जो इस अवधारणा को स्पष्ट करे।  

                4️⃣ **मजेदार तथ्य:**  
                - इस विषय से जुड़ा कोई दिलचस्प तथ्य साझा करें।  

                5️⃣ **क्या आप इसे समझ पाए?**  
                - इस प्रश्न का उत्तर दें: [यहाँ इस विषय से संबंधित एक सरल प्रश्न जोड़ें]।  

                उत्तर को स्पष्ट और सुव्यवस्थित रूप से प्रस्तुत करें, जिसमें बुलेट पॉइंट, उचित रिक्ति और क्रमबद्ध सूची हो।`;
            } else {
                prompt = `Explain "${doubt}" in a simple and easy-to-understand way, language for a beginner. Format the response as follows:  

                1️⃣ **Definition:**  
                - Provide a short and simple definition of the concept in bullet points.

                2️⃣ **Everyday Analogy:**  
                - Use a relatable analogy from daily life to make the concept easier to grasp.  

                3️⃣ **Example:**  
                - Give one easy-to-understand example that illustrates the concept.  

                4️⃣ **Fun Fact:**  
                - Share an interesting fun fact related to the topic.  

                5️⃣ **Want to test your learning?**  
                -  [Insert simple question related to the topic here].  

                Answer in ${language}. Ensure clarity and readability using bullet points, spacing, and line breaks.`;
            }
            break;

        case "explorer":
            if (language === "hindi") {
                prompt = `"${doubt}" का एक संतुलित और व्यवस्थित व्याख्या करें। उत्तर को निम्नलिखित प्रारूप में प्रस्तुत करें:  

                1️⃣ **परिभाषा:**   
                - अवधारणा (concept) की एक छोटी और आसान परिभाषा दें।  

                2️⃣ **कदम-दर-कदम प्रक्रिया:**  
                - इस प्रक्रिया या तंत्र के चरणों को तार्किक क्रम में समझाएँ।  

                3️⃣ **वास्तविक उदाहरण:**  
                - कोई व्यावहारिक उदाहरण दें जो इस अवधारणा को स्पष्ट करता हो।  

                4️⃣ **यादगार ट्रिक या रोचक तथ्य:**  
                - कोई ऐसा मज़ेदार तथ्य या स्मरणीय तरीका बताएं जो इसे याद रखने में मदद करे।  

                5️⃣ **खुद को परखें:**  
                - इस प्रश्न का उत्तर दें: [यहाँ विषय से संबंधित कोई विचारशील प्रश्न जोड़ें]।  

                उत्तर को स्पष्ट और पढ़ने में आसान रखें। क्रमबद्ध सूची, बुलेट पॉइंट और उचित रिक्ति का उपयोग करें।`;
            } else {
                prompt = `Explain "${doubt}" at an intermediate level with a structured breakdown. Format the response as follows:  

                1️⃣ **Key Points:**  
                - Summarize the main aspects of the concept in bullet points.These main aspects should be further explained in bullet points.  

                2️⃣ **Step-by-Step Process:**  
                - Outline the process or mechanism behind the concept in a logical sequence.  

                3️⃣ **Real-World Example:**  
                - Provide a practical example that demonstrates the concept in action.  

                4️⃣ **Memory Trick or Fun Fact:**  
                - Include an interesting fact or a mnemonic to help retain the information.  

                5️⃣ **Want to challenge yourself?**  
                - Try this: [Insert a thought-provoking question related to the topic here].  

                Answer in ${language}. Ensure clarity and readability using numbered points, spacing, and line breaks.`;
            }
            break;

        case "expert":
            if (language === "hindi") {
                prompt = `"${doubt}" की गहन और विस्तृत व्याख्या करें। उत्तर को निम्नलिखित संरचना में प्रस्तुत करें:  

                1️⃣ **विस्तृत व्याख्या:**  
                - तकनीकी शब्दावली का उपयोग करें और अवधारणा का गहराई से विश्लेषण करें।  

                2️⃣ **चरण-दर-चरण विश्लेषण:**  
                - प्रक्रिया, विधि, या तर्क प्रणाली को विस्तार से समझाएँ।  

                3️⃣ **प्रभावकारी कारक और व्यावहारिक अनुप्रयोग:**  
                - प्रमुख कारकों और वास्तविक दुनिया में इसके उपयोगों पर चर्चा करें।  

                4️⃣ **चुनौतियाँ और नवीनतम प्रगति:**  
                - इस विषय में आने वाली चुनौतियों, बहसों, या हाल के विकासों का उल्लेख करें।  

                5️⃣ **क्या आप और गहराई में जानना चाहते हैं?**  
                - इस पर विचार करें: [यहाँ इस विषय से संबंधित एक उन्नत प्रश्न या चर्चा बिंदु जोड़ें]।  

                उत्तर को सुव्यवस्थित, क्रमबद्ध, और स्पष्ट रखें।`;
            } else {
                prompt = `Provide a detailed, advanced explanation of "${doubt}" with a structured breakdown. Format the response as follows:  

                1️⃣ **In-Depth Explanation:**  
                - Use precise terminology.
                - Provide a thorough breakdown of the concept.  

                2️⃣ **Step-by-Step Analysis:**  
                - Explain 
                    - Logical process.
                    - Method or framework behind it.  

                3️⃣ **Influencing Factors & Practical Applications:**  
                - key factors affecting it.
                - How it's applied in real-world scenarios? 

                4️⃣ **Challenges & Recent Developments:**  
                -  limitations.
                -  latest advancements related to it.  

                5️⃣ **Want to explore further?**  
                - Consider this: [Insert an advanced question or discussion point related to the topic here].  

                Answer in ${language}. Ensure clarity using structured paragraphs, numbered points, and line breaks.`;
            }
            break;

        default:
            prompt = `Explain "${doubt}" in ${language}.`;
    }

    return prompt;
};

export default generateDoubtPrompt;
