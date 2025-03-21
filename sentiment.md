# Sentiment Analysis MVP

## Overview  
The sentiment analysis project aims to collect and analyze tweets mentioning a specific brand (e.g., `@indigo6e`) over the past week using the Twitter API. The collected tweets will be processed and sent to an AI service, such as OpenAI’s API, to classify them based on two parameters:  

- **Type:** e.g., “service,” “flight delay”  
- **Sentiment:** e.g., “anger,” “frustration”  

The analyzed data will be visualized through a simple web-based UI that presents sentiment trends and key insights in an interactive and intuitive format.  

## Expected Deliverables  
- **Data Collection Scripts:** Fetch tweets using the Twitter API.  
- **AI Processing Modules:** Process and classify sentiment using OpenAI’s API.  
- **Functional Dashboard:** Visualize sentiment trends and key insights.  

## Tech Stack  

### Backend  
- **Node.js (Express):** API handling and Twitter API integration.  
- **OpenAI API:** Sentiment classification.  

### Frontend  
- **Next.js with Tailwind CSS:** Web-based dashboard.  
- **Chart.js or D3.js:** Interactive data visualizations.  

## Features  
- **Tweet Collection:** Fetch and store tweets mentioning the brand.  
- **Sentiment Analysis:** Classify tweets based on type and sentiment.  
- **Data Visualization:** Display trends through interactive charts.  

## Success Criteria  
- **Accurate Sentiment Classification:** AI correctly identifies tweet sentiment.  
- **Real-time Data Processing:** Tweets are analyzed within minutes of collection.  
- **User-Friendly Dashboard:** Easy-to-understand sentiment trends.  
