# Language Town Roadmap

This roadmap tracks major goals, feature work, fixes, and future milestones for Language Town.

## 1. Stabilize Core Website

- [ ] Test every main page after recent changes: Village, Study, Quiz, Tone Practice, Vocabulary, Villagers, Products, Recipes, Night Market, Testing.
- [ ] Fix mobile layout issues.
- [ ] Make all pop-up windows scrollable and comfortable on phone screens.
- [ ] Make all buttons and actions give clear feedback.
- [ ] Add back or return options where players may feel stuck.
- [ ] Standardize UI wording across pages.
- [ ] Make sure all Mandarin content uses Traditional Chinese only.
- [ ] Remove or hide admin/testing pages from normal player navigation later.

## 2. Performance and Save Data

- [ ] Continue reducing unnecessary localStorage reads and writes.
- [ ] Move large vocabulary data out of the player save over time.
- [ ] Store only player progress in save data.
- [ ] Add save backup, export, and import tools.
- [ ] Add a reset progress confirmation flow.
- [ ] Add data versioning so future updates do not break old saves.
- [ ] Audit large files in the repo, especially dictionary and vocabulary files.

## 3. Village Gameplay

- [ ] Polish build mode.
- [ ] Improve moving, building, and bulldozing feedback.
- [ ] Add clearer locked tile messaging.
- [ ] Finish ocean tile behavior.
- [ ] Improve building visuals and icons.
- [ ] Add building detail pages or richer building modals.
- [ ] Balance building costs and upgrade costs.
- [ ] Add more building unlocks by level.
- [ ] Add town progression goals.

## 4. Farming, Products, and Animals

- [ ] Finish crop product system.
- [ ] Finish ranch animal system.
- [ ] Finish fishing boat seafood system.
- [ ] Add more crops, animals, and seafood.
- [ ] Add product generation timers or daily collection logic.
- [ ] Add product inventory instead of only capacity.
- [ ] Add luxury/regional crop unlock quests.
- [ ] Add market sale balancing.
- [ ] Add culture rewards for luxury products.
- [ ] Make Products page an admin-only management page later.

## 5. Farmer Mei and Villagers

- [ ] Expand Farmer Mei level 1 and 2 dialogue.
- [ ] Add Farmer Mei level 3-5 questions.
- [ ] Add crop-specific Farmer Mei dialogue.
- [ ] Add luxury crop quest dialogue.
- [ ] Add villager-specific conversation pools for every villager.
- [ ] Keep villager themes separate.
- [ ] Add relationship-based dialogue changes.
- [ ] Add quest queues for all villagers.
- [ ] Add villager profile details and personality flavor.
- [ ] Add daily and weekly villager events.

## 6. Study, Quiz, and Tone Practice

- [ ] Polish Tone Practice UI.
- [ ] Add better explanations after wrong answers.
- [ ] Add support for both tone marks and numbered pinyin everywhere.
- [ ] Add spaced and unspaced pinyin handling.
- [ ] Add review scheduling.
- [ ] Add mastery states that are easy to understand.
- [ ] Improve Study page filtering.
- [ ] Improve Vocabulary page search and filtering.
- [ ] Add pagination or show more controls for large vocab lists.
- [ ] Add reading, listening, and sentence practice modes later.

## 7. Vocabulary and Content

- [ ] Finish B1 vocabulary review.
- [ ] Finish B2 vocabulary review.
- [ ] Create Discovery Packs for luxury crops.
- [ ] Create Discovery Packs for recipes.
- [ ] Add content QA checklist: Traditional Chinese, pinyin, meaning, level-appropriate sentence, tone distractors.
- [ ] Add import validation for CSV files.
- [ ] Add warnings for missing columns.
- [ ] Add duplicate detection.
- [ ] Build a long-term content database structure.

## 8. Recipes and Night Market

- [ ] Finish Recipes admin page.
- [ ] Add recipe ingredient requirements.
- [ ] Add recipe Discovery Packs.
- [ ] Add Mayor recipe discovery quests.
- [ ] Make Night Market slots consume or require ingredients.
- [ ] Add recipe research completion.
- [ ] Add coins and culture generation from recipes.
- [ ] Add Night Market upgrade balancing.
- [ ] Add recipe collection and progression page.
- [ ] Add Taiwanese dish content: scallion pancakes, bubble tea, beef noodle soup, lu rou fan, tea eggs, oyster omelet, and more.

## 9. User Accounts and Login

- [ ] Decide backend/platform: Firebase, Supabase, custom backend, or another option.
- [ ] Add user sign-up and login.
- [ ] Save player progress to the cloud.
- [ ] Support playing on phone and computer with the same account.
- [ ] Add password reset.
- [ ] Add account settings.
- [ ] Add private/admin-only access for Products, Recipes, and Testing.
- [ ] Add roles: player and admin/content editor.
- [ ] Plan data privacy and backup strategy.

## 10. Interest-Based Specialization

- [ ] During player setup, ask the player to choose and rank their top hobbies or activities.
- [ ] Let players choose around four or five interests, such as going to the gym, drinking coffee, watching anime, watching movies, music, cooking, travel, sports, gaming, or other hobbies.
- [ ] Store the ranked interests as part of the player profile.
- [ ] Use the player's highest-ranked interests to decide which hobby visitors appear first.
- [ ] At later player levels, spawn a visitor near Town Hall with a thought bubble.
- [ ] Let the visitor introduce themself and pitch a new hobby building for the village.
- [ ] Start a related Discovery Pack when the player accepts the visitor's proposal.
- [ ] Unlock a new villager and the related hobby building after the Discovery Pack is mastered.
- [ ] Limit each hobby building to one copy unless a later design says otherwise.
- [ ] Add daily collectible rewards above hobby buildings, such as floating coins above a Gym.
- [ ] Increase hobby building reward capacity as the building levels up.
- [ ] Build a Gym example path:
  - [ ] Player ranks going to the gym as a top interest.
  - [ ] A visitor appears near Town Hall at the appropriate level.
  - [ ] The visitor asks whether the town would be interested in a Gym.
  - [ ] The Gym Discovery Pack begins.
  - [ ] Mastering the pack introduces The Coach as a new villager.
  - [ ] Gym becomes available to build, with a max of one.
  - [ ] Gym generates daily coins that appear as a floating collectible above the building.
  - [ ] Higher Gym levels increase coin capacity.
- [ ] In the far future, add an optional trained AI chat experience with The Coach inside the Gym interface.
- [ ] Design other hobby buildings and villagers using the same pattern.
- [ ] Make hobby-based content specialize language learning around the player's real interests.

## 11. Going Live

- [ ] Confirm GitHub Pages deployment is stable.
- [ ] Set up a custom domain if desired.
- [ ] Test on phone browsers.
- [ ] Test on desktop browsers.
- [ ] Create a simple landing/start page for new players.
- [ ] Add basic instructions/tutorial.
- [ ] Add changelog or version notes.
- [ ] Add bug report/contact method.
- [ ] Decide when the site is alpha ready.
- [ ] Share with a small group of testers.

## 12. Adding New Languages

- [ ] Decide how language should work in the game long term.
- [ ] Separate game UI language from target study language.
- [ ] Make vocabulary packs language-specific.
- [ ] Add support for non-Mandarin pronunciation systems.
- [ ] Add language-specific practice modes.
- [ ] Add new villagers or regions for each language if desired.
- [ ] Add admin tools for uploading new language packs.
- [ ] Make content filters work by language.
- [ ] Avoid hardcoding Mandarin-only assumptions in reusable systems.

## 13. Long-Term Game Features

- [ ] Add quests beyond Discovery Packs.
- [ ] Add festivals and events.
- [ ] Add achievements.
- [ ] Add town decorations.
- [ ] Add citizen requests.
- [ ] Add collections: crops, dishes, words, villagers.
- [ ] Add daily streak rewards.
- [ ] Add level cap expansion.
- [ ] Add story chapters.
- [ ] Add optional audio pronunciation.

## Milestones

### Milestone 1: Stable Local Alpha

- [ ] Core pages work.
- [ ] Saves are stable.
- [ ] Farmer Mei conversations work.
- [ ] Tone Practice works.
- [ ] Village progression is playable locally.

### Milestone 2: Public GitHub Pages Alpha

- [ ] Site is live.
- [ ] Site is mobile-friendly.
- [ ] Site is playable from a phone using browser-local saves.

### Milestone 3: Content Alpha

- [ ] Farmer Mei content is strong.
- [ ] Core crops are usable.
- [ ] First luxury crop loop is complete.
- [ ] First recipe loop is complete.
- [ ] First Night Market loop is complete.

### Milestone 4: Account-Based Beta

- [ ] Players can log in.
- [ ] Progress saves online.
- [ ] Players can continue across devices.

### Milestone 5: Admin Content Tools

- [ ] Products page is admin-only.
- [ ] Recipes page is admin-only.
- [ ] Vocabulary tools are admin/content-editor friendly.
- [ ] Testing page is admin-only.

### Milestone 6: Expanded Language Platform

- [ ] New target languages can be added without rebuilding the whole game.
- [ ] Language-specific vocabulary, pronunciation, and practice systems are supported.

### Milestone 7: Interest-Based Specialization

- [ ] Player setup collects ranked interests.
- [ ] First hobby visitor flow works.
- [ ] First hobby Discovery Pack works.
- [ ] First hobby villager unlock works.
- [ ] First hobby building can be built and upgraded.
- [ ] First hobby building generates collectible daily rewards.
