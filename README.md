# Suportal

This is the repo for Suportal frontend and Nextjs API

## Files & Contents

`components/api-key`
- houses api key component code to provide their own `api-key` on the `developer` plan and calls the `/api/billing/save-api-key` endpoint

`components/auth-form`
- houses the generic authentication form that enables log in and sign up, mostly interacts with `/api/login` and `/api/signup`

`components/bot-form`
- houses the chatbot creation form and has a child component in `components/paths` file to list out all links fetch from url provided, train Suportal on the content created, get links from the link provided tied to the chatbot

`components/button`
- contains custom button component

`components/counter` 
- holds the purple component above billing plans in the `/billing` page, shows a count of the chat usage

`components/input`
- contains custom input and textarea component

`components/layout`
- overlays the entire page to enable smooth transitions between pages

`components/link`
- component that houses a single website path link with information if its trained or not

`components/navbar`
- holds the navbar component seen when a user logs in

`components/plans`
- renders all plans created under Suportal on Stripe

`components/tabs`
- contains the tab component

`lib/embed-string`
- exports a string that is used to load the iframe widget

`lib/gpt-parser`
- handle streaming from openai, decodes and encodes the response to have the typing effect on responses

`lib/identify`
- exports a function that generates a user's device fingerprint

`lib/sanitizer` 
- cleans long strings by removing emojis, unicode charactes and new lin characters

`lib/stripe`
- exports the stripe class instantiated

`pages/api/ai/embed`
> [POST]: `/api/ai/embed`
- get best context to inject in prompt through cosine similarity, 

`pages/billing/chat-counter`
> [GET]: `/api/billing/chat-counter`
- get a chatbot chat's counter

`pages/billing/checkout`
> [POST]: `/api/billing/checkout`
- generates the url to redirect to stripe checkout on the specific checkout

`pages/billing/create`
> [POST, GET]: `/api/billing/create`
- create billing record on database, and fetch it

`pages/billing/index`
> [GET]: `/api/billing`
- get billing tried to chatbot

`pages/billing/plans`
> [GET]: `/api/billing/plans`
- get stripe plans created on the dashboard

`pages/billing/save-api-key`
> [POST]: `/api/billing/save-api-key`
- save own api to the database

`pages/billing/subscribe`
> [POST]: `/api/billing/subscribe`
- creates a subscription tied to a customer

`pages/chat/index`
> [POST]: `/api/chat`
- send prompt to openai to get a response that will rendered in chat

`pages/api/chat/limit`
> [GET]: `/api/chat/limit`
- used to check if a chat has exceeded their chat counter

`pages/api/chat/tracker`
> [POST]: `/api/chat/tracker`
- updates chat usage table with new chats to update the counter

`pages/api/chatbot/links/[chatbot_id]`
> [POST]: `/api/chatbot/links/[chatbot_id]`
- get all links tied to the chatbot

`pages/api/chatbot/index`
> [GET,POST]: `/api/chatbot`
- get chatbot tied to account

`pages/api/cron`
- subscription cron endpoint to check if billing should be reset based on billing expiry date

`pages/api/events/links/[chatbot_id]`
> [POST]: `/api/events/links`
- webhook that contains links for a website

`pages/api/events/stripe`
> [POST]: `/api/events/stripe`
- webhook for stripe payments

`pages/api/widget/[identifier]`
> [GET]: `/api/widget/[identifier]`
- returns javascript in mimetype `application/javascript` based on the chatbot

`pages/api/get-content`
> [POST]: `/api/get-content
- makes a request to the scrapper to get content for all links tied to a website link for a chatbot

`pages/api/get-links`
> [POST]: `/api/get-links`
- makes a request to the scrapper to get links for a website link tied to a chatbot
