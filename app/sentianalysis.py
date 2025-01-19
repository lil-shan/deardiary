
import os

from groq import Groq

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

completion = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[
        {
            "role": "system",
            "content": "Perform a detailed sentiment analysis of the following personal journal entry. The analysis should include:\n\nOverall sentiment score (positive, neutral, negative).\nKey phrases contributing to the sentiment, categorized as positive or negative.\nSentiment intensity (mild, moderate, strong).\nSpecific emotions detected (e.g., joy, sadness, anger, surprise).\nSuggestions for improving the mood based on the analysis.\nJournal Entry: '[Insert journal entry here]'\n\nExample Input: 'Today was a rollercoaster of emotions. I felt incredibly happy in the morning when I got a surprise call from an old friend. However, the afternoon was stressful due to a tight deadline at work. By evening, I was exhausted but relieved to have completed my tasks.'\n\nExample Output:\n\nOverall Sentiment: Mixed (positive with mild negative aspects)\nPositive Key Phrases: \"incredibly happy,\" \"surprise call from an old friend,\" \"relieved to have completed my tasks\"\nNegative Key Phrases: \"stressful due to a tight deadline,\" \"exhausted\"\nSentiment Intensity: Moderate\nDetected Emotions: Joy (morning), Stress and Exhaustion (afternoon and evening)\nMood Improvement Suggestions: Consider setting more realistic deadlines or seeking support during high-stress periods. Reflect on the positive moments of the day to end on a happier note.\"\nUse this structure to provide a comprehensive analysis of the journal entry.\n\nnew line for each attribute\n"
        },
        {
            "role": "user",
            "content": "Today was quite overwhelming. I woke up feeling tired and unmotivated, despite getting a full night's sleep. The day started with a series of back-to-back meetings, leaving me no time to focus on my tasks. I felt frustrated and under pressure. However, in the evening, I went for a walk in the park, which helped clear my mind. The fresh air and the sound of birds chirping lifted my spirits a bit. Although the day was tough, I am grateful for the peaceful walk that ended it on a slightly better note"
        }
    ],
    temperature=1,
    max_completion_tokens=1024,
    top_p=1,
    stream=True,
    stop=None,
)

for chunk in completion:
    print(chunk.choices[0].delta.content or "", end="")
