import en from './content.json';
import zh from './content-zh.json';
const pairs={
 'Behind the café':'小屋背面','Meet the real cats':'认识真实的小猫们','Close cat credits':'关闭小猫致谢','A LITTLE THANK-YOU':'一份小小的感谢','For my little muses.':'献给我的小小灵感家。','Crème · Sesame · Pudding':'焦焦 · 小黑 · 布丁','Thank you for the company, the inspiration, and all the little moments that make me smile. There’s a little bit of each of you in Alice Wonderlab.':'谢谢你们的陪伴、灵感，还有那些让我忍不住微笑的小瞬间。Alice Wonderlab 里，也藏着你们每一位的影子。','With love, Alice':'爱你们的 Alice','Nine snapshots. Three very good cats.':'九个可爱瞬间，三位特别嘉宾。','Pause floating photos':'暂停照片漂浮','Resume floating photos':'继续照片漂浮',
 'A little coconut surprise.':'一颗椰子带来的小插曲。',
 'Shake gently':'轻轻摇一摇','Give the coconut tree a little shake':'轻轻摇一摇大椰子树','A little shake?':'轻轻摇一下？','Close island story':'关闭小岛故事','A tiny island incident':'小岛突发小事件','SESAME · ISLAND REPAIR CREW':'小黑 · 小岛维修队',
 'Oops. Coconut delivery!':'哎呀，椰子空投！','The deck has a little crack. Ask the café cats to fix it?':'地板被砸坏了一小块。需要拜托小猫维修吗？','Ask Sesame to help':'拜托小黑维修','Maybe later':'一会儿再说',
 'Hard hat on. Paws ready.':'安全帽戴好，猫爪准备！','Sesame is on the way. Tiny paws, very serious business.':'小黑正在赶来。爪爪虽小，修理可是认真的。','A little island makeover.':'小岛装修进行中。','Tap, tap… almost good as new.':'敲敲打打……马上就修好啦。','Deck repair progress':'地板维修进度',
 'Good as new!':'修好啦，焕然一新！','Two taps. Three seconds. One very talented cat.':'敲两下，三秒搞定。小黑师傅，手艺一流。','Thank you! Give 5 treats':'谢谢！送你五颗猫粮','Five treats?! For me?':'五颗猫粮？！给我的？','Another milk tea, here I come! Best. Side quest. Ever.':'耶，又可以买一杯奶茶啦！今天这份兼职，值了！','Enjoy your milk tea!':'快去喝奶茶吧！',

 'Tour':'参观','A little wander':'在小岛走走','Explore the café':'参观咖啡厅','Close café tour':'收起参观菜单','Pick a corner. Stay a little.':'选个角落，慢慢逛一会儿。','Island overview':'小岛全景','Café entrance':'咖啡厅门口','Tea counter':'奶茶吧台','Rooftop terrace':'屋顶露台','Cat lounge':'猫咪休息区','By the sea':'海边钓鱼台','Drag to look around. Take your time.':'拖动环顾四周，慢慢欣赏。',
 'Back to café':'返回咖啡馆','Alice Wonderlab home':'返回 Alice Wonderlab 首页','A creative little hideaway':'藏着创意的海边小天地','A little world.':'一个小世界。','Full of ideas.':'装满奇思妙想。','Get to know me, one corner':'从咖啡馆的每个角落，','of the café at a time.':'慢慢认识我。',
 'About':'关于我','Experience':'工作经历','Projects':'项目','Skills':'技能','Portfolio sections':'作品集栏目',
 'Four cups. Four chapters.':'四杯奶茶，四段故事。','Pick a cup to open a chapter of my experience.':'点击一杯奶茶，看看我的一段工作经历。','Pull up a little desktop.':'打开我的小小桌面。','Tap the register to explore my projects.':'点击收银机，探索我的项目。','Something good is brewing.':'好创意，正在酝酿。','A jasmine milk tea, with a little of everything I do.':'一杯茉莉奶茶，调和我的不同技能。',
 'Close About':'关闭关于我','A little version of me.':'小小的我。','Character inspiration':'人物创作灵感','3D portrait of Alice\'s original character':'Alice 原始人物模型的 3D 肖像','Close experience':'关闭工作经历','← Previous cup':'← 上一杯','Next cup →':'下一杯 →','Previous experience':'上一段经历','Next experience':'下一段经历',
 'ALICE\'S DESKTOP / PROJECTS':'我的小小桌面 / 项目','Close Projects':'关闭项目','A space for things I\'ve made':'收纳我创作的作品','Projects are brewing.':'项目正在酝酿中。','A few stories, experiments, and ideas will be moving in here soon.':'新的故事、尝试和创意，即将搬进这里。','Project spaces reserved for future work':'为后续作品预留的项目空间','Coming soon':'即将更新','Saved a little room for what\'s next.':'为下一份创作，留一点空间。','0 projects / more to come':'尚未添加项目 / 敬请期待',
 'THE JASMINE TEA LAB / SKILLS':'茉莉奶茶实验室 / 技能','Close tea game':'关闭制茶游戏','A little blend of my skills.':'调一杯我的技能。','Make a jasmine milk tea. Meet the skills in every ingredient.':'做一杯茉莉奶茶，认识每种材料背后的技能。','Restart tea game':'重新开始制茶','Restart':'重新开始','Recipe progress':'制茶进度','Empty tea shaker':'空摇杯','Tap or drag the ingredient into the shaker.':'点击材料，或把它拖进摇杯。','Opening the café…':'咖啡馆正在开门…','Bringing the little details to life…':'正在唤醒这个小世界…','The café could not finish loading. Please reload.':'咖啡馆加载未完成，请重新加载。',
 'Ice':'冰块','Jasmine tea':'茉莉茶','Milk':'牛奶','Syrup':'糖浆','Shake':'摇匀','A closer look at this skill is coming soon.':'这项技能的详细介绍，即将更新。','Add each ingredient to discover the next skill.':'加入材料，解锁下一项技能。','The finishing touch':'最后一步','Shake it into something good.':'摇一摇，让美味相遇。','A little strategy. A little creativity. All mixed together.':'一点策略，一点创意，把它们好好融合。','Drag the shaker from side to side, or tap the button twice.':'左右拖动摇杯，或点击按钮两次。','Shake it!':'摇一摇！','Give the shaker two good shakes.':'认真摇两次，就可以出杯啦。','Approved by the café cats':'咖啡馆小猫认证','Purr-fectly brewed.':'喵～这一杯，绝了。','Five out of five stars':'五星满分','Crème, the café\'s orange cat':'咖啡馆的橘猫焦焦','CRÈME · CHIEF TASTE TESTER':'焦焦 · 首席试喝官','“10/10. I was going to knock this off the counter… but I\'m drinking it instead.”':'“满分！本来想把它推下桌……算了，还是我喝掉吧。”','Make another cup':'再做一杯','Jasmine milk tea, made with all four skills.':'融合四项技能的茉莉奶茶，完成。','Perfect!':'完美！','Perfect! Your jasmine milk tea is ready. Five stars from Crème.':'完美！茉莉奶茶做好了，焦焦给你五星。','Open the desktop':'打开小桌面','Make a jasmine milk tea':'做一杯茉莉奶茶','Projects desktop. Projects coming soon.':'项目桌面已打开，内容即将更新。','Back at the café.':'已返回咖啡馆。',
 'Play Seaside':'播放《海滨》','Pause Seaside':'暂停《海滨》','Seaside · Taki':'《海滨》· 龙一Taki','Music selected by Wanyi':'Wanyi 的音乐选择','Language':'语言','Choose language':'选择语言','Play seaside piano and ocean waves':'播放海边钢琴与海浪声','Pause seaside piano and ocean waves':'暂停海边钢琴与海浪声','Seaside piano':'海边钢琴','Music volume':'音乐音量','Music settings':'音乐设置','Piano + ocean':'钢琴与海浪','Sound credits':'声音来源','Ring for a meow':'按铃听一声喵','Meow! At your service.':'喵～小猫为你服务。','Music is paused.':'音乐已暂停。','Music is playing.':'音乐正在播放。',
 // Existing scene interactions were originally authored in Chinese.
 'Close cat conversation':'关闭对话','Fish for a snack':'钓鱼投喂','Have some milk tea':'喝点奶茶','You\'re welcome ♡':'不客气 ♡','Sounds good':'好呀','Click the fishing rod to reel it in, or use the button below.':'点击鱼竿收线，也可以点下面的按钮','Reel it in':'拉起鱼竿','Give it to Crème':'给焦焦','Back to the cats':'回到小猫身边','Crème takes a little sip of milk tea…':'焦焦喝了一小口奶茶…','Let\'s catch a little fish for Crème.':'给焦焦钓一条小鱼吧','Reeling in… a fish is on the hook!':'收线中…小鱼上钩了！','Mmm… delicious!':'嗯…好喝！','Caught a little fish!':'钓到一条小鱼！','Thank you!':'谢谢','I\'m sooo hungry…':'好饿。。。','This milk tea is amazing! I need to save more kibble money for my next cup.':'这家奶茶太好喝了，我要多攒一点猫粮来买','It\'s so peaceful here. I could come back every day.':'这里好惬意啊，我要一直来这里','Creme':'焦焦','Sesame':'小黑','Pudding':'布丁'
};
for(const key of ['title','intro','storyTitle'])pairs[en.about[key]]=zh.about[key];
en.about.story.forEach((paragraph,i)=>pairs[paragraph.text]=zh.about.story[i].text);
en.skills.forEach((s,i)=>{for(const key of ['name','ingredient','verb','note'])pairs[s[key]]=zh.skills[i][key];s.bullets.forEach((b,j)=>pairs[b]=zh.skills[i].bullets[j]);});
en.experiences.forEach((s,i)=>{for(const key of ['short','company','descriptor','location','dates','role','previous','flavor'])if(s[key]&&zh.experiences[i][key])pairs[s[key]]=zh.experiences[i][key];s.bullets.forEach((b,j)=>pairs[b]=zh.experiences[i].bullets[j]);});
Object.assign(pairs,{
 'Project navigation':'项目翻页','Project progress':'项目阅读进度','← Previous project':'← 上一个项目','Next project →':'下一个项目 →','Close projects':'退出项目',
 '03 / Projects':'03 / 项目','Ideas, out in the world.':'把想法，变成作品。','Three projects shaped by curiosity, community, and creative work.':'从内容创作、社群支持到品牌经营，记录三段实践。','Explore project':'查看项目','← All projects':'← 全部项目','From strategy to something real.':'从策略出发，让创意落地。','3 projects':'3 个项目','Projects desktop. Explore three projects.':'项目桌面已打开，探索三个项目。','Turn music off':'关闭音乐','Music off':'音乐已关闭','Game sounds':'游戏音效','Interactive 3D tea bar':'可互动的 3D 制茶台','The illustrated tea bar is available.':'已启用插画制茶界面。'
});
en.projects.forEach((p,i)=>{for(const key of ['title','category','role','dates','summary','metricLabel'])pairs[p[key]]=zh.projects[i][key];for(const key of ['tags','bullets'])p[key].forEach((v,j)=>pairs[v]=zh.projects[i][key][j]);});
for(const key of ['name','note'])pairs[en.management[key]]=zh.management[key];
en.management.bullets.forEach((b,i)=>pairs[b]=zh.management.bullets[i]);
Object.assign(pairs,{
 'Download résumé':'下载简历',
 'Download Wanyi Wei’s résumé (PDF)':'下载 Wanyi Wei 的简历（PDF）',
 'A little behind the scenes':'创作的幕后小帮手',
 'My everyday toolkit.':'我的常用工具',
 'For design, video, and the insights behind the work.':'做设计、剪视频，也用数据把想法打磨得更好。',
 'Design & create':'设计与创作',
 'Edit & tell stories':'剪辑与叙事',
 'Analyze & understand':'分析与洞察',
 'Explore my tools':'看看我的工具箱'
});
Object.assign(pairs,{
 "THE REAL CATS BEHIND THE CAFÉ": "小屋背后的真实小猫们",
 "Our little family album.": "我们的小小相册",
 "The café crew.": "小店的三位主角",
 "Off the clock.": "今天也要好好休息",
 "The little things.": "把小日子装进相册",
 "Some of my favourite moments are the quiet ones: a sunny nap, a silly pose, and three little reminders to slow down.": "喜欢和你们待着的安静时刻：晒晒太阳、睡个午觉，再摆一个奇怪的姿势。是你们提醒我，偶尔慢下来也很好。",
 "Birthday treats, ridiculous poses, and things only a cat would notice. Thank you for making ordinary days feel a little more special.": "生日的小零食、让人笑出声的奇怪姿势，还有只有猫猫才会发现的小事。谢谢你们，让普通的日子也变得值得纪念。",
 "Tap a photo to take a closer look.": "轻点照片，就能凑近看看。",
 "Album navigation": "相册翻页",
 "Previous album page": "相册上一页",
 "Next album page": "相册下一页",
 "Previous": "上一页",
 "Next": "下一页",
 "Back to the album": "返回相册",
 "Meet the crew": "认识小猫们",
 "Off duty": "休息时间",
 "Little celebrations": "值得纪念的小事",
 "What if treats fall from the sky? Someone has to watch.": "万一天下掉猫条呢？我得盯着。",
 "I have a plan. Step one: snacks.": "我有个计划。第一步：先吃。",
 "Security is on duty. Horizontally.": "本店门卫，躺着执勤。",
 "No treats? No entry.": "没带猫条？不许进。",
 "Creative department: buffering. Do not disturb.": "创意部门正在加载……请勿叫醒。",
 "Yoga instructor. Absolutely no qualifications.": "瑜伽教练，主打一个毫无章法。",
 "I heard a snack bag. Explain yourself.": "我听见拆零食的声音了。解释一下？",
 "My face says chill. My legs have other plans.": "脸：很淡定。腿：有自己的想法。",
 "My birthday wish? Open the treats already.": "愿望许好了：快把零食打开。",
 "Sesame looking up": "小黑抬头看天空",
 "Crème sitting": "乖乖坐着的焦焦",
 "Sesame relaxing": "休息中的小黑",
 "Sesame posing": "摆好姿势的小黑",
 "Crème taking a nap": "睡午觉的焦焦",
 "Pudding rolling over": "打滚的布丁",
 "Pudding looking at you": "看着你的布丁",
 "Pudding lounging on the floor": "在地板上摆出搞笑姿势的布丁",
 "Crème with a birthday treat": "和生日小零食合影的焦焦",
 "Crème": "焦焦",
 "Sesame": "小黑",
 "Pudding": "布丁",
 "Album page 1 of 3": "相册第 1 页，共 3 页",
 "Album page 2 of 3": "相册第 2 页，共 3 页",
 "Album page 3 of 3": "相册第 3 页，共 3 页"
});
const reverse=new Map(Object.entries(pairs).map(([a,b])=>[b,a]));
reverse.set('给 Creme','Give it to Crème');
reverse.set('Creme 喝了一小口奶茶…','Crème takes a little sip of milk tea…');
reverse.set('给 Creme 钓一条小鱼吧',"Let's catch a little fish for Crème.");
export function createLocalizer(){
 let lang='en';try{lang=localStorage.getItem('alice-language')==='zh'?'zh':'en';}catch{}
 const records=new WeakMap(),attributeRecords=new WeakMap(),observers=new Map();
 function canonical(s){return reverse.get(s)||s;}
 function translate(s){let c=canonical(s);if(lang==='en')return c;if(pairs[c])return pairs[c];
  let m=c.match(/^(0[1234]) \/ (About|Experience|Projects|Skills)(?: · Chapter 0(\d))?$/);if(m)return`${m[1]} / ${pairs[m[2]]}${m[3]?' · 第 '+m[3]+' 段故事':''}`;
  m=c.match(/^Ingredient 0(\d) \/ (.+)$/);if(m)return`材料 0${m[1]} / ${pairs[m[2]]||m[2]}`;
  m=c.match(/^(\d) \/ 2 shakes$/);if(m)return`已摇 ${m[1]} / 2 次`;
  m=c.match(/^Project 0(\d)$/);if(m)return`项目 0${m[1]}`;
  m=c.match(/^(About|Experience|Projects|Skills) section\.$/);if(m)return`已进入${pairs[m[1]]}。`;
  m=c.match(/^Read (.+)$/);if(m)return`阅读${pairs[m[1]]||m[1]}的经历`;
  m=c.match(/^Open (.+) experience$/);if(m)return`打开${pairs[m[1]]||m[1]}的工作经历`;
  m=c.match(/^(.+) added\.$/);if(m)return`已加入${pairs[m[1]]||m[1]}。`;
  m=c.match(/^Shaker with (.+)$/);if(m)return`摇杯内已加入：${m[1].split(', ').map(x=>pairs[x[0].toUpperCase()+x.slice(1)]||x).join('、')}`;
  for(const exp of en.experiences){if(c===`${exp.company}, ${exp.role}.`)return`${pairs[exp.company]||exp.company}，${pairs[exp.role]||exp.role}。`;}
  return c;
 }
 function text(node){if(!node.data.trim())return;if(!node.parentElement||node.parentElement.closest('script,style,[data-no-translate]'))return;let record=records.get(node);if(!record||node.data!==record.last)record={source:canonical(node.data.trim()),before:node.data.match(/^\s*/)[0],after:node.data.match(/\s*$/)[0]};const value=record.before+translate(record.source)+record.after;if(node.data!==value)node.data=value;record.last=value;records.set(node,record);}
 function attrs(el){if(el.closest('[data-no-translate]'))return;let map=attributeRecords.get(el)||{};for(const attr of ['aria-label','title','alt','placeholder']){if(!el.hasAttribute(attr))continue;const val=el.getAttribute(attr);let rec=map[attr];if(!rec||rec.last!==val)rec={source:canonical(val)};const next=translate(rec.source);if(next!==val)el.setAttribute(attr,next);rec.last=next;map[attr]=rec;}attributeRecords.set(el,map);}
 function walk(node){if(node.nodeType===3){text(node);return;}if(node.nodeType!==1||node.matches('script,style,[data-no-translate]'))return;attrs(node);const walker=document.createTreeWalker(node,NodeFilter.SHOW_TEXT);let n;while(n=walker.nextNode())text(n);node.querySelectorAll('[aria-label],[title],[alt],[placeholder]').forEach(attrs);}
 function attach(){for(const id of ['portfolio-root','cat-dialogue','fishing-hud']){const el=document.getElementById(id);if(!el||observers.has(el))continue;const observer=new MutationObserver(changes=>{for(const c of changes){if(c.type==='characterData')text(c.target);else if(c.type==='attributes')attrs(c.target);else for(const node of c.addedNodes)walk(node);}});observer.observe(el,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','title','alt','placeholder']});observers.set(el,observer);walk(el);}}
 function refresh(){document.documentElement.lang=lang==='zh'?'zh-CN':'en';document.body.dataset.language=lang;attach();observers.forEach((_,el)=>walk(el));}
 new MutationObserver(attach).observe(document.body,{childList:true});
 function setLanguage(value){lang=value==='zh'?'zh':'en';try{localStorage.setItem('alice-language',lang);}catch{}refresh();window.dispatchEvent(new CustomEvent('alice:language-change',{detail:{language:lang}}));}
 refresh();return {get language(){return lang;},setLanguage,refresh,translate};
}
