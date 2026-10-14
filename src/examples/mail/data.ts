/* 邮箱示例的假数据：全部在内存里，刷新即复原 */
import { useLang } from '../../i18n';
import type { Lang } from '../../i18n';

export interface Person { name: string; email: string }
export type AttachmentKind = 'pdf' | 'sheet' | 'image' | 'doc' | 'zip';
export interface Attachment { name: string; size: string; kind: AttachmentKind }
/** 正文块：字符串是段落；quote 是引用块；list 是列表 */
export type Block = string | { quote: string; cite?: string } | { list: string[]; ordered?: boolean };
export interface Message { id: string; from: Person; to: Person[]; at: number; body: Block[]; attachments?: Attachment[] }

export type FolderId = 'inbox' | 'sent' | 'drafts' | 'archive' | 'spam' | 'trash';
export type LabelId = 'work' | 'finance' | 'travel' | 'notice';
/** 一行邮件 = 一个会话，messages 按时间从旧到新 */
export interface Mail { id: string; folder: FolderId; subject: string; messages: Message[]; unread: boolean; starred: boolean; labels: LabelId[] }

/** 侧栏当前看的是什么：文件夹、星标，或某个标签 */
export type ViewId = FolderId | 'starred' | `label:${LabelId}`;
export type ListFilter = 'all' | 'unread' | 'starred';

/** 收件 / 发件时间都相对这一刻 */
const HOUR = 3600_000;
const NOW = Date.now();
const ago = (hours: number) => NOW - Math.round(hours * HOUR);

/*
 * 带文字的数据（文件夹名、联系人、邮件内容、时间格式）分中英两份，按语言组装成一套 MailData，
 * 组件里用 useMail() 取当前语言的那份。切换语言时整个示例会重新挂载，邮件状态按新语言重新播种。
 * 假邮件只写一份结构，每段文字用 x('中文', 'English') 挨着写；两种语言的编号、时间、标签、附件类型完全一致。
 */
export interface MailData {
  lang: Lang;
  FOLDERS: Array<{ id: FolderId; name: string }>;
  LABELS: Array<{ id: LabelId; name: string; tone: 'info' | 'success' | 'warning' | 'neutral' }>;
  /** 强调色的色样。库里没有按名字取强调色的令牌，这里的值照抄 tokens.css 的 [data-accent] 段 */
  ACCENT_SWATCHES: Array<{ value: string; color: string; label: string }>;
  ME: Person;
  /** 写邮件时的联系人建议 */
  CONTACTS: Person[];
  SEED: Mail[];
  /** “检查新邮件”时依次到达的几封 */
  INCOMING: Array<{ subject: string; from: Person; body: Block[]; labels: LabelId[] }>;
  /** 自动附上的签名（含前面的空行） */
  SIGNATURE: string;
  NO_SUBJECT: string;
  folderName: (id: FolderId) => string;
  labelOf: (id: LabelId) => MailData['LABELS'][number];
  viewName: (view: ViewId) => string;
  messageText: (m: Message) => string;
  snippetOf: (m: Mail) => string;
  /** 列表里显示的“谁”：别人发来的显示发件人；自己发的显示收件人 */
  counterpart: (m: Mail) => { person: Person; prefix: string };
  /** 列表用的短时间：今天显示时分，昨天、本周、更早依次变粗 */
  shortTime: (at: number) => string;
  fullTime: (at: number) => string;
}

type X = (zh: string, en: string) => string;

function buildData(lang: Lang): MailData {
  const en = lang === 'en';
  const x: X = (zh, e) => (en ? e : zh);

  const FOLDERS: MailData['FOLDERS'] = [
    { id: 'inbox', name: x('收件箱', 'Inbox') },
    { id: 'sent', name: x('已发送', 'Sent') },
    { id: 'drafts', name: x('草稿', 'Drafts') },
    { id: 'archive', name: x('归档', 'Archive') },
    { id: 'spam', name: x('垃圾邮件', 'Spam') },
    { id: 'trash', name: x('已删除', 'Trash') },
  ];
  const LABELS: MailData['LABELS'] = [
    { id: 'work', name: x('工作', 'Work'), tone: 'info' },
    { id: 'finance', name: x('财务', 'Finance'), tone: 'success' },
    { id: 'travel', name: x('出行', 'Travel'), tone: 'warning' },
    { id: 'notice', name: x('通知', 'Notifications'), tone: 'neutral' },
  ];
  const ACCENT_SWATCHES = [
    { value: 'pink', color: '#FF6B8E', label: x('粉', 'Pink') },
    { value: 'orange', color: '#FF7A2F', label: x('橙', 'Orange') },
    { value: 'amber', color: '#FFBE3B', label: x('黄', 'Amber') },
    { value: 'green', color: '#4CD787', label: x('绿', 'Green') },
    { value: 'blue', color: '#2E7BFF', label: x('蓝', 'Blue') },
    { value: 'violet', color: '#C77DFF', label: x('紫', 'Violet') },
  ];

  const folderName = (id: FolderId) => FOLDERS.find((f) => f.id === id)?.name ?? id;
  const labelOf = (id: LabelId) => LABELS.find((l) => l.id === id)!;
  const viewName = (view: ViewId): string => {
    if (view === 'starred') return x('星标邮件', 'Starred');
    if (view.startsWith('label:')) return labelOf(view.slice(6) as LabelId).name;
    return folderName(view as FolderId);
  };

  /* ---------------------------------------------------------------- 人 */

  const ME: Person = en ? { name: 'Grace Moore', email: 'grace@oink.example' } : { name: '顾南乔', email: 'nanqiao@oink.example' };
  // 同事：名字和邮箱前缀都分两份
  const p = (zh: string, enName: string, zhMail: string, enMail: string): Person => ({ name: x(zh, enName), email: `${x(zhMail, enMail)}@oink.example` });
  const ext = (name: string, email: string): Person => ({ name, email });
  const P = {
    lin: p('林知夏', 'Lena Hart', 'zhixia.lin', 'lena.hart'),
    zhou: p('周屿', 'Owen Brooks', 'yu.zhou', 'owen.brooks'),
    chen: p('陈墨', 'Marcus Reed', 'mo.chen', 'marcus.reed'),
    su: p('苏晚', 'Sophie Lane', 'wan.su', 'sophie.lane'),
    he: p('何以宁', 'Hannah Price', 'yining.he', 'hannah.price'),
    tang: p('唐棠', 'Tessa Grant', 'tang.tang', 'tessa.grant'),
    jiang: p('江予白', 'Julian West', 'yubai.jiang', 'julian.west'),
    meng: p('孟繁星', 'Maya Stone', 'fanxing.meng', 'maya.stone'),
    hr: p('人力资源部', 'People Team', 'hr', 'people'),
    fin: p('财务共享中心', 'Finance Shared Services', 'finance', 'finance'),
    it: p('IT 服务台', 'IT Help Desk', 'it-helpdesk', 'it-helpdesk'),
    admin: p('行政部', 'Office Admin', 'admin', 'admin'),
    ci: ext(x('构建机器人', 'Build Bot'), 'ci@builds.oink.example'),
    cal: ext(x('日历', 'Calendar'), 'calendar@oink.example'),
    air: ext(x('东方航空', 'Bluewing Airlines'), 'service@airline.example'),
    hotel: ext(x('栖云酒店', 'Cloudrest Hotels'), 'booking@hotel.example'),
    bank: ext(x('招商银行信用卡', 'Harbor Bank Card Services'), 'notice@bank.example'),
    cloud: ext(x('云服务账单', 'Cloud Billing'), 'billing@cloud.example'),
    design: ext(x('设计周刊', 'Design Weekly'), 'weekly@designletter.example'),
    expr: ext(x('顺丰速运', 'Swift Express'), 'notify@express.example'),
    vendor: ext(x('许闻笛（青藤印务）', 'Wendy Shaw (Ivy Print Co.)'), x('wendi.xu@qingteng.example', 'wendy.shaw@ivyprint.example')),
    client: ext(x('沈清和（北辰科技）', 'Sam Hayes (Northstar Tech)'), x('qinghe.shen@beichen.example', 'sam.hayes@northstar.example')),
    promo1: ext(x('年终大促', 'Year-End Mega Sale'), 'deal@promo-mall.example'),
    promo2: ext(x('中奖通知中心', 'Prize Notification Center'), 'winner@lucky-prize.example'),
  };
  const CONTACTS: Person[] = [P.lin, P.zhou, P.chen, P.su, P.he, P.tang, P.jiang, P.meng, P.vendor, P.client, P.hr, P.fin, P.it];

  /* ---------------------------------------------------------------- 邮件 */

  // 每种语言各从 0 编号，两份数据的 id 一一对应
  let seq = 0;
  const msg = (from: Person, hoursAgo: number, body: Block[], attachments?: Attachment[], to: Person[] = [ME]): Message =>
    ({ id: `m${++seq}`, from, to, at: ago(hoursAgo), body, attachments });
  interface Flags { unread?: boolean; starred?: boolean; labels?: LabelId[]; folder?: FolderId }
  const mail = (subject: string, messages: Message[], flags: Flags = {}): Mail =>
    ({ id: `c${++seq}`, folder: flags.folder ?? 'inbox', subject, messages, unread: !!flags.unread, starred: !!flags.starred, labels: flags.labels ?? [] });
  const NO_SUBJECT = x('（无主题）', '(no subject)');

  const SEED: Mail[] = [
    /* -------------------------------------------------------------- 收件箱 */
    mail(x('Q4 产品路线图评审：周四前请给意见', 'Q4 roadmap review: feedback by Thursday, please'), [
      msg(P.zhou, 26, [
        x('南乔，路线图初稿放在共享盘了，先请你和知夏过一遍。重点是“工作台”和“自动化”两条线的先后顺序。',
          'Grace, the first draft of the roadmap is on the shared drive. Could you and Lena go through it first? The main question is the order of the “Workspace” and “Automation” tracks.'),
        x('我的倾向是工作台先行，因为它能直接带动留存；自动化放到 12 月再发。',
          'My take is that Workspace goes first, since it directly drives retention. Automation can ship in December.'),
      ], [{ name: x('Q4-路线图-初稿.pdf', 'Q4-roadmap-draft.pdf'), size: '2.4 MB', kind: 'pdf' }], [ME, P.lin]),
      msg(ME, 22, [
        x('看完了。顺序我同意，但工作台的范围偏大，建议拆成两期：',
          'Done reading. I agree with the order, but Workspace is too big. I’d split it into two phases:'),
        {
          list: [
            x('一期：自定义布局、最近访问、全局搜索入口', 'Phase 1: custom layouts, recently viewed, a global search entry point'),
            x('二期：小组件市场、跨团队共享视图', 'Phase 2: widget marketplace, views shared across teams'),
          ],
          ordered: true,
        },
        x('另外自动化的权限模型需要安全组提前介入，别等到开发中期。',
          'Also, the security team should get involved in the Automation permission model early, not halfway through development.'),
      ], undefined, [P.zhou, P.lin]),
      msg(P.lin, 0.4, [
        x('我补充三点，评审会上可以直接讨论：', 'Three things to add, which we can pick up in the review:'),
        {
          list: [
            x('工作台一期的验收指标建议用“7 日回访率”，而不是点击量', 'Measure Workspace phase 1 by “7-day return rate”, not clicks'),
            x('全局搜索依赖的索引服务本季度要扩容，成本我让财务估一下', 'The index service behind global search needs more capacity this quarter. I’ve asked Finance to estimate the cost'),
            x('自动化的灰度名单先从内部团队开始', 'Start the Automation rollout with internal teams'),
          ],
        },
        {
          quote: x('自动化的权限模型需要安全组提前介入，别等到开发中期。', 'The security team should get involved in the Automation permission model early, not halfway through development.'),
          cite: ME.name,
        },
        x('这一条我已经约了安全组周三下午，南乔方便的话一起来。评审会定在周四 14:00，三楼“松果”会议室。',
          'I’ve already booked the security team for Wednesday afternoon. Join us if you can, Grace. The review is Thursday at 2:00 PM in the “Pinecone” room on the 3rd floor.'),
      ], [
        { name: x('评审议程.docx', 'Review-agenda.docx'), size: '86 KB', kind: 'doc' },
        { name: x('成本估算-v2.xlsx', 'Cost-estimate-v2.xlsx'), size: '412 KB', kind: 'sheet' },
      ], [ME, P.zhou]),
    ], { unread: true, starred: true, labels: ['work'] }),

    mail(x('【待审批】10 月差旅报销单 ￥3,286.50', '[Approval needed] October travel expenses, $3,286.50'), [
      msg(P.fin, 1.2, [
        x('顾南乔，你好：', 'Hi Grace,'),
        x('陈墨提交的差旅报销单（单号 BX-2026-10-0412）正在等待你的审批，金额合计 ￥3,286.50。',
          'A travel expense report from Marcus Reed (no. EX-2026-10-0412) is waiting for your approval. Total: $3,286.50.'),
        {
          list: [
            x('高铁往返（上海—杭州）：￥438.00', 'Round-trip train (Boston–New York): $438.00'),
            x('住宿两晚：￥1,960.00', 'Hotel, two nights: $1,960.00'),
            x('市内交通与餐补：￥888.50', 'Local transport and meals: $888.50'),
          ],
        },
        x('请在 3 个工作日内处理，逾期将自动转交上一级审批人。',
          'Please review it within 3 business days. After that it will be passed to the next approver automatically.'),
      ], [{ name: x('报销明细.pdf', 'Expense-details.pdf'), size: '318 KB', kind: 'pdf' }]),
    ], { unread: true, labels: ['finance'] }),

    mail(x('设计走查：新版结算页的 6 处问题', 'Design QA: 6 issues on the new checkout page'), [
      msg(P.su, 2.5, [
        x('走查记录整理好了，整体还原度不错，下面几处需要调一下：',
          'Here are my design QA notes. The build is very close to the mocks overall, but a few things need adjusting:'),
        {
          list: [
            x('优惠券入口的点按区域只有 32px，触屏上偏小', 'The coupon tap target is only 32px, too small on touch screens'),
            x('金额数字没有用等宽数字，滚动时会抖', 'Amounts don’t use tabular figures, so they jitter while scrolling'),
            x('“提交订单”在加载态下仍然可以重复点击', '“Place order” can still be clicked again while it’s loading'),
            x('深色模式里分隔线对比度不够', 'Dividers lack contrast in dark mode'),
            x('地址卡片的圆角和外层容器不同心', 'The address card’s corner radius isn’t concentric with its container'),
            x('错误提示只靠红色区分，缺少图标', 'Error messages rely on red alone, with no icon'),
          ],
          ordered: true,
        },
        x('截图和标注都在附件里。前三条建议这周修掉，后三条可以排到下个迭代。',
          'Screenshots and annotations are attached. I’d fix the first three this week; the other three can go into the next sprint.'),
      ], [
        { name: x('走查标注.zip', 'Design-QA-notes.zip'), size: '5.8 MB', kind: 'zip' },
        { name: x('结算页-对比.png', 'Checkout-comparison.png'), size: '1.1 MB', kind: 'image' },
      ]),
    ], { unread: true, labels: ['work'] }),

    mail(x('构建失败：web-app #4821（main）', 'Build failed: web-app #4821 (main)'), [
      msg(P.ci, 3.1, [
        x('流水线 web-app #4821 在“单元测试”阶段失败，触发提交：a3f9c1e「结算页：金额改用等宽数字」。',
          'Pipeline web-app #4821 failed at the “Unit tests” stage. Triggered by commit a3f9c1e “Checkout: use tabular figures for amounts”.'),
        {
          quote: x('FAIL src/checkout/Summary.test.tsx › 合计金额 › 四舍五入到分\n期望 "￥128.50"，实际 "￥128.5"',
            'FAIL src/checkout/Summary.test.tsx › Total › rounds to the cent\nExpected "$128.50", received "$128.5"'),
        },
        x('共 1 个用例失败，1,284 个通过。失败的用例最近 30 天内没有不稳定记录。',
          '1 test failed, 1,284 passed. The failing test hasn’t been flaky in the last 30 days.'),
      ]),
    ], { unread: true, labels: ['notice'] }),

    mail(x('周五团建：报名和饮食偏好', 'Friday team outing: sign-up and dietary needs'), [
      msg(P.tang, 5, [
        x('大家好～这个月的团建定在周五下午，去西郊的陶艺工作室，结束后一起吃饭。',
          'Hi all! This month’s team outing is Friday afternoon at a pottery studio on the west side, with dinner afterwards.'),
        x('请在周三下班前回复这封邮件，告诉我：', 'Please reply to this email by end of day Wednesday and let me know:'),
        {
          list: [
            x('是否参加', 'Whether you’re coming'),
            x('有没有忌口或过敏', 'Any dietary restrictions or allergies'),
            x('是否需要搭班车（16:30 公司楼下出发）', 'Whether you need the shuttle (leaves from the lobby at 4:30 PM)'),
          ],
        },
        x('名额 24 人，先到先得。', 'There are 24 spots, first come, first served.'),
      ], undefined, [ME, P.zhou, P.chen, P.su, P.he]),
    ], { labels: ['work'] }),

    mail(x('回复：供应商合同第 7 条的修改意见', 'Re: Proposed changes to clause 7 of the supplier contract'), [
      msg(ME, 30, [
        x('许经理，合同草案我们法务看过了，第 7 条“交付延期”的违约金比例希望从 0.5%/日 调整为 0.3%/日，并设置总额上限 10%。',
          'Hi Wendy, our legal team has reviewed the draft. For clause 7 (late delivery), we’d like the penalty lowered from 0.5% to 0.3% per day, capped at 10% in total.'),
        x('其余条款没有异议。', 'We’re fine with all the other terms.'),
      ], undefined, [P.vendor]),
      msg(P.vendor, 6.5, [
        x('顾先生好，意见收到。', 'Hi Grace, thanks for the feedback.'),
        x('违约金比例我们可以接受 0.3%/日，但总额上限希望定在 15%，理由是这批物料的备货周期比较长。',
          'We can accept 0.3% per day, but we’d like the cap set at 15%, since lead times on these materials are long.'),
        { quote: x('其余条款没有异议。', 'We’re fine with all the other terms.'), cite: ME.name },
        x('如果没问题，我今天把修订版发过来，争取本周内双方盖章。',
          'If that works for you, I’ll send the revised version today so we can both sign this week.'),
      ], [{ name: x('采购合同-修订版.docx', 'Purchase-contract-revised.docx'), size: '152 KB', kind: 'doc' }]),
    ], { starred: true, labels: ['work', 'finance'] }),

    mail(x('你的航班 MU5137 已出票', 'Your flight BW 5137 is ticketed'), [
      msg(P.air, 8, [
        x('顾南乔 先生：您预订的机票已出票，请核对行程信息。', 'Dear Ms. Moore, your ticket has been issued. Please check your itinerary below.'),
        {
          list: [
            x('10 月 21 日 08:15 上海虹桥 T2 → 10:35 北京首都 T2', 'Oct 21, 8:15 AM San Francisco (SFO) Terminal 2 → 10:35 AM Seattle (SEA)'),
            x('航班 MU5137，经济舱，座位 32A', 'Flight BW 5137, Economy, seat 32A'),
            x('票号 781-2406518830', 'Ticket no. 781-2406518830'),
          ],
        },
        x('请至少提前 90 分钟到达机场。可在起飞前 48 小时通过 App 办理值机。',
          'Please arrive at the airport at least 90 minutes before departure. Check-in opens in the app 48 hours before takeoff.'),
      ], [{ name: x('电子行程单.pdf', 'E-ticket-receipt.pdf'), size: '94 KB', kind: 'pdf' }]),
    ], { labels: ['travel'] }),

    mail(x('入住确认：栖云酒店（北京国贸店）10/21–10/23', 'Booking confirmed: Cloudrest Hotel Downtown Seattle, Oct 21–23'), [
      msg(P.hotel, 8.4, [
        x('感谢预订。您的订单已确认：高级大床房一间，两晚，含双早。',
          'Thank you for booking with us. Your reservation is confirmed: one Deluxe King room for two nights, breakfast for two included.'),
        x('入住时间 14:00 之后，退房时间 12:00 之前。如需提前入住请回复本邮件，我们会尽量安排。',
          'Check-in is from 2:00 PM and check-out is by noon. If you need to check in early, reply to this email and we’ll do our best.'),
      ]),
    ], { labels: ['travel'] }),

    mail(x('新人入职：下周一的导师安排', 'New hires: mentor assignments for next Monday'), [
      msg(P.hr, 11, [
        x('南乔你好，下周一有两位新同事加入你的团队：前端工程师江予白、产品设计师孟繁星。',
          'Hi Grace, two new people join your team next Monday: Julian West, a frontend engineer, and Maya Stone, a product designer.'),
        x('想请你担任江予白的入职导师，主要职责：', 'We’d like you to be Julian’s onboarding mentor. That mainly means:'),
        {
          list: [
            x('第一周每天 15 分钟的同步', 'A 15-minute check-in every day of the first week'),
            x('帮助熟悉代码仓库和发布流程', 'Helping him find his way around the codebase and release process'),
            x('第 30 天一起做一次回顾', 'A retrospective together on day 30'),
          ],
        },
        x('入职手册和首周清单见附件。', 'The onboarding handbook and first-week checklist are attached.'),
      ], [{ name: x('导师手册.pdf', 'Mentor-handbook.pdf'), size: '1.3 MB', kind: 'pdf' }]),
    ], { unread: true, labels: ['work'] }),

    mail(x('用户访谈纪要（第 3 轮，8 位商家）', 'User interview notes (round 3, 8 merchants)'), [
      msg(P.he, 20, [
        x('第三轮访谈做完了，一句话结论：商家最在意的不是功能多，而是对账不出错。',
          'Round three is done. The one-line takeaway: merchants care less about having more features and more about reconciliation being right.'),
        {
          quote: x('我宁愿少两个报表，也不要月底对不上账的时候没人能告诉我差在哪。', 'I’d rather have two fewer reports than have nobody able to tell me where the gap is when the books don’t balance at month-end.'),
          cite: x('受访商家 C（连锁烘焙）', 'Merchant C (bakery chain)'),
        },
        x('详细纪要和录音转写在附件，建议产品和研发各抽 20 分钟看一下原话。',
          'Full notes and transcripts are attached. I’d suggest product and engineering each spend 20 minutes reading the actual quotes.'),
      ], [{ name: x('访谈纪要-第三轮.pdf', 'Interview-notes-round-3.pdf'), size: '3.6 MB', kind: 'pdf' }]),
    ], { starred: true, labels: ['work'] }),

    mail(x('日程提醒：明天 10:00 一对一（周屿）', 'Reminder: 1:1 with Owen Brooks tomorrow at 10:00 AM'), [
      msg(P.cal, 21, [
        x('明天 10:00–10:30，你和周屿有一场一对一，地点：线上会议。', 'Tomorrow 10:00–10:30 AM you have a 1:1 with Owen Brooks. Location: video call.'),
        x('议程：季度目标复盘、下季度人力。', 'Agenda: review of quarterly goals, headcount for next quarter.'),
      ]),
    ], { labels: ['notice'] }),

    mail(x('信用卡 10 月账单已出', 'Your October credit card statement is ready'), [
      msg(P.bank, 27, [
        x('您尾号 4417 的信用卡本期账单已出：应还金额 ￥6,412.08，最低还款 ￥641.21，到期还款日 11 月 5 日。',
          'The statement for your card ending in 4417 is ready: balance due $6,412.08, minimum payment $641.21, due Nov 5.'),
        x('如已设置自动还款，请确保扣款账户余额充足。', 'If you’ve set up autopay, please make sure the linked account has enough funds.'),
      ]),
    ], { unread: true, labels: ['finance'] }),

    mail(x('云资源账单：9 月用量环比上升 18%', 'Cloud bill: September usage up 18% from August'), [
      msg(P.cloud, 33, [
        x('9 月账单已生成，合计 ￥42,860.00，环比上升 18%。主要增量来自：',
          'Your September bill is ready: $42,860.00 in total, up 18% from last month. Most of the increase came from:'),
        {
          list: [
            x('对象存储外网流量：+￥3,900', 'Object storage egress: +$3,900'),
            x('搜索集群新增 2 个节点：+￥2,400', 'Two new search cluster nodes: +$2,400'),
            x('日志服务存储：+￥680', 'Log storage: +$680'),
          ],
        },
        x('建议检查静态资源的缓存策略，上月有 31% 的请求未命中 CDN。',
          'We recommend reviewing how static assets are cached: 31% of requests missed the CDN last month.'),
      ], [{ name: x('账单明细-2026-09.xlsx', 'Billing-details-2026-09.xlsx'), size: '740 KB', kind: 'sheet' }]),
    ], { labels: ['finance'] }),

    mail(x('设计周刊 #218：把“空状态”当成第一屏来设计', 'Design Weekly #218: Treat the empty state as your first screen'), [
      msg(P.design, 46, [
        x('本期主题是空状态。大多数用户第一次打开产品时看到的就是它，但它往往是最后才被设计的一屏。',
          'This issue is about empty states. It’s the first thing most people see when they open a product, yet it’s often the last screen to get designed.'),
        {
          list: [
            x('一句说清“这里会出现什么”', 'One sentence on what will show up here'),
            x('一个能立刻开始的主操作', 'One primary action to get started right away'),
            x('别放装饰性的大插画挤掉操作', 'No big decorative illustration crowding out the action'),
          ],
        },
        x('另外推荐三篇关于表单校验时机的文章，链接见网页版。', 'Plus three good reads on when to validate forms. Links are in the web version.'),
      ]),
    ], { labels: ['notice'] }),

    mail(x('密码将在 7 天后过期', 'Your password expires in 7 days'), [
      msg(P.it, 49, [
        x('你的域账号密码将在 7 天后过期。请在公司网络内访问账号中心修改，新密码不能与最近 5 次相同。',
          'Your network account password expires in 7 days. Change it in the account center while on the company network. It can’t match any of your last 5 passwords.'),
        x('如有疑问请联系 IT 服务台，分机 8000。', 'Questions? Contact the IT Help Desk at ext. 8000.'),
      ]),
    ], { labels: ['notice'] }),

    mail(x('关于埋点命名规范的讨论', 'Naming conventions for analytics events'), [
      msg(P.chen, 54, [
        x('现在各业务线的埋点命名很乱，同一个“点击提交”有四种写法。我起草了一版规范，核心是“对象_动作”两段式。',
          'Event naming across teams is a mess: the same “click submit” is written four different ways. I drafted a convention built around a two-part “object_action” format.'),
        x('想听听你的意见，尤其是老事件要不要迁移。', 'I’d like your take, especially on whether to migrate old events.'),
      ], [{ name: x('埋点命名规范-草案.docx', 'Event-naming-draft.docx'), size: '64 KB', kind: 'doc' }]),
      msg(ME, 52, [
        x('两段式我支持。老事件建议不迁移，加一层映射表，报表侧统一口径就行，迁移成本太高了。',
          'I support the two-part format. I wouldn’t migrate old events, though. Add a mapping table and align definitions on the reporting side; migrating would cost too much.'),
      ], undefined, [P.chen]),
      msg(P.chen, 50, [x('同意，那我在规范里加一节“历史事件映射”。周五前发全员。', 'Agreed. I’ll add a “Legacy event mapping” section and send it to everyone before Friday.')]),
    ], { labels: ['work'] }),

    mail(x('快递已签收：办公用品 3 件', 'Delivered: 3 items of office supplies'), [
      msg(P.expr, 58, [x('您的快件（运单尾号 8825）已由前台代签收，签收时间 10 月 10 日 15:42。', 'Your package (tracking number ending in 8825) was signed for at the front desk on Oct 10 at 3:42 PM.')]),
    ], { labels: ['notice'] }),

    mail(x('合作方来访：周三下午接待安排', 'Partner visit: Wednesday afternoon'), [
      msg(P.client, 70, [
        x('顾经理好，我们一行四人周三 14:30 到贵司，想重点看一下数据看板的演示，以及接口对接的排期。',
          'Hi Grace, four of us will be at your office on Wednesday at 2:30 PM. We’d mainly like to see a dashboard demo and go over the API integration timeline.'),
        x('如果方便，能否提前发一份对接文档？', 'If possible, could you send the integration docs ahead of time?'),
      ]),
    ], { unread: true, starred: true, labels: ['work'] }),

    mail(x('工位调整通知（11 月 1 日起）', 'Desk move notice (starting Nov 1)'), [
      msg(P.admin, 75, [
        x('因 6 楼装修，产品研发部自 11 月 1 日起临时搬至 4 楼东区，座位表见附件。',
          'Because of renovations on the 6th floor, Product & Engineering will move to the east side of the 4th floor from Nov 1. The seating chart is attached.'),
        x('搬迁当周周五下午统一打包，周一恢复办公，个人物品请自行贴好标签。',
          'We’ll pack up together on the Friday afternoon of moving week and be back at our desks on Monday. Please label your personal belongings.'),
      ], [{ name: x('4F-座位表.pdf', '4F-seating-chart.pdf'), size: '520 KB', kind: 'pdf' }]),
    ], { labels: ['notice'] }),

    mail(x('性能周报：首屏 P75 回落到 1.9s', 'Performance weekly: first-screen P75 back down to 1.9s'), [
      msg(P.jiang, 96, [
        x('上周上线的图片懒加载和字体子集化起效了：', 'The image lazy-loading and font subsetting we shipped last week are paying off:'),
        {
          list: [
            x('首屏 P75：2.6s → 1.9s', 'First screen P75: 2.6s → 1.9s'),
            x('交互延迟 P75：180ms → 140ms', 'Interaction latency P75: 180ms → 140ms'),
            x('包体积：减少 212 KB', 'Bundle size: down 212 KB'),
          ],
        },
        x('下周准备处理第三方脚本的阻塞问题。', 'Next week I’ll tackle render-blocking third-party scripts.'),
      ], [{ name: x('性能周报-W41.pdf', 'Performance-weekly-W41.pdf'), size: '880 KB', kind: 'pdf' }]),
    ], { labels: ['work'] }),

    mail(x('请确认：年度体检预约时间', 'Action needed: book your annual health checkup'), [
      msg(P.hr, 120, [x('今年的体检可预约时间为 10 月 20 日至 11 月 30 日，请在福利平台选择机构和日期。未在 11 月 10 日前预约的同事将由系统随机分配。',
        'This year’s checkups can be booked from Oct 20 to Nov 30. Please pick a clinic and date on the benefits portal. Anyone who hasn’t booked by Nov 10 will be assigned a slot at random.')]),
    ], {}),

    mail(x('读书会第 12 期：《系统之美》', 'Book club #12: Thinking in Systems'), [
      msg(P.meng, 144, [x('这期读第 3–4 章，周四 19:00 在 5 楼休息区。欢迎带上你觉得“越治越乱”的真实案例。',
        'This time we’re reading chapters 3–4, Thursday at 7:00 PM in the 5th-floor lounge. Bring a real example of something that got worse the harder people tried to fix it.')]),
    ], {}),

    /* -------------------------------------------------------------- 已发送 */
    mail(x('对接文档与演示账号', 'Integration docs and demo account'), [
      msg(ME, 66, [
        x('沈经理好，对接文档和演示环境的账号见附件，周三见面时我们可以直接基于它讨论排期。',
          'Hi Sam, the integration docs and demo environment login are attached. We can use them as the starting point for the timeline discussion on Wednesday.'),
        x('演示账号有效期到本月底。', 'The demo account is valid until the end of the month.'),
      ], [{ name: x('开放接口对接文档-v3.pdf', 'API-integration-guide-v3.pdf'), size: '2.0 MB', kind: 'pdf' }], [P.client]),
    ], { folder: 'sent', labels: ['work'] }),
    mail(x('请假申请：10 月 24 日（周五）', 'Time off: Friday, Oct 24'), [
      msg(ME, 90, [x('周屿，10 月 24 日我想请一天年假，手头的评审我会在周四前处理完，紧急事项可以找知夏。',
        'Owen, I’d like to take Oct 24 off. I’ll finish the reviews on my plate by Thursday, and Lena can cover anything urgent.')], undefined, [P.zhou]),
    ], { folder: 'sent' }),
    mail(x('回复：结算页排期', 'Re: Checkout page schedule'), [
      msg(ME, 100, [x('走查的前三条本周五前修完，后三条排进下个迭代，我已经在看板上建好了卡片。',
        'The first three QA issues will be fixed by Friday and the other three go into the next sprint. I’ve already added cards for them on the board.')], undefined, [P.su, P.jiang]),
    ], { folder: 'sent', labels: ['work'] }),
    mail(x('九月团队费用汇总', 'September team expenses'), [
      msg(ME, 170, [x('财务同事好，九月的团队费用汇总见附件，其中两笔跨月的差旅已单独标注。',
        'Hi Finance team, the September team expense summary is attached. Two trips that span both months are marked separately.')],
      [{ name: x('团队费用-2026-09.xlsx', 'Team-expenses-2026-09.xlsx'), size: '96 KB', kind: 'sheet' }], [P.fin]),
    ], { folder: 'sent', labels: ['finance'] }),
    mail(x('推荐信：何以宁', 'Recommendation: Hannah Price'), [
      msg(ME, 240, [x('附上我为以宁写的内部晋升推荐信，如需补充材料请随时告诉我。',
        'Attached is my recommendation for Hannah’s internal promotion. Let me know if you need anything else.')],
      [{ name: x('推荐信.pdf', 'Recommendation-letter.pdf'), size: '71 KB', kind: 'pdf' }], [P.hr]),
    ], { folder: 'sent' }),

    /* -------------------------------------------------------------- 草稿 */
    mail(x('关于自动化功能灰度方案的想法', 'Thoughts on the Automation rollout plan'), [
      msg(ME, 4, [x('知夏，关于灰度我有个不太一样的想法：与其按团队放量，不如按“每周创建规则数”来圈人，这样能更早拿到重度用户的反馈……',
        'Lena, I have a slightly different idea for the rollout: instead of ramping up team by team, we could pick people by “rules created per week”, so we hear from power users sooner…')], undefined, [P.lin]),
    ], { folder: 'drafts', labels: ['work'] }),
    mail(NO_SUBJECT, [
      msg(ME, 60, [x('许经理，修订版我看了，总额上限我们再内部确认一下', 'Wendy, I’ve read the revised version. We still need to confirm the cap internally')], undefined, [P.vendor]),
    ], { folder: 'drafts' }),

    /* -------------------------------------------------------------- 归档 */
    mail(x('Q3 复盘会议纪要', 'Q3 retrospective notes'), [
      msg(P.lin, 300, [
        x('Q3 复盘的结论和待办整理如下：', 'Here are the conclusions and action items from the Q3 retro:'),
        {
          list: [
            x('留存目标达成 96%，缺口主要在新商家首月', 'We reached 96% of the retention goal; the gap is mostly new merchants in their first month'),
            x('发布节奏从双周改为单周后，回滚次数下降一半', 'Since moving from biweekly to weekly releases, rollbacks have halved'),
            x('跨团队需求的评审周期仍然偏长，Q4 试行“周二集中评审”', 'Cross-team requests still take too long to review. In Q4 we’ll try batching reviews on Tuesdays'),
          ],
        },
      ], [{ name: x('Q3-复盘.pdf', 'Q3-retro.pdf'), size: '1.8 MB', kind: 'pdf' }]),
    ], { folder: 'archive', labels: ['work'] }),
    mail(x('发票已开具：办公设备采购', 'Invoice issued: office equipment purchase'), [
      msg(P.fin, 340, [x('你申请的增值税专用发票已开具并寄出，快递单号见附件扫描件。', 'The invoice you requested has been issued and mailed. The tracking number is on the attached scan.')],
        [{ name: x('发票扫描件.pdf', 'Invoice-scan.pdf'), size: '240 KB', kind: 'pdf' }]),
    ], { folder: 'archive', labels: ['finance'] }),
    mail(x('上海—成都 行程单', 'Itinerary: Chicago – Denver'), [
      msg(P.air, 500, [x('您 9 月 12 日的行程已完成，电子行程单可在 App 内下载，有效期 30 天。', 'Your Sep 12 trip is complete. You can download the e-ticket receipt in the app for the next 30 days.')]),
    ], { folder: 'archive', labels: ['travel'] }),
    mail(x('代码评审规范 v2 已生效', 'Code review guidelines v2 now in effect'), [
      msg(P.jiang, 420, [x('新版评审规范今天起生效，最大的变化是：超过 400 行的合并请求必须拆分，或提前约一次走读。',
        'The new review guidelines take effect today. The biggest change: merge requests over 400 lines must be split up, or you need to book a walkthrough in advance.')]),
    ], { folder: 'archive', labels: ['work'] }),

    /* -------------------------------------------------------------- 垃圾邮件 */
    mail(x('恭喜！您已被抽中为幸运用户', 'Congratulations! You’ve been chosen as a lucky winner'), [
      msg(P.promo2, 15, [x('尊敬的用户，您的邮箱在本期活动中被抽中，请在 24 小时内点击链接领取奖品，逾期作废。',
        'Dear user, your email address was drawn in this month’s giveaway. Click the link within 24 hours to claim your prize, or it will be forfeited.')]),
    ], { folder: 'spam', unread: true }),
    mail(x('年终清仓，全场一折起，仅限今日', 'Year-end clearance: up to 90% off, today only'), [
      msg(P.promo1, 40, [x('数码、家电、服饰全场一折起，前 100 名下单再送好礼。退订请回复 TD。',
        'Up to 90% off electronics, appliances and apparel. The first 100 orders get a free gift. Reply STOP to unsubscribe.')]),
    ], { folder: 'spam', unread: true }),

    /* -------------------------------------------------------------- 已删除 */
    mail(x('会议室预订已取消', 'Room booking canceled'), [
      msg(P.cal, 80, [x('你预订的 3F“松果”会议室（10 月 9 日 16:00）已取消。', 'Your booking for the “Pinecone” room on 3F (Oct 9, 4:00 PM) has been canceled.')]),
    ], { folder: 'trash', labels: ['notice'] }),
    mail(x('问卷：食堂满意度调查', 'Survey: how’s the cafeteria?'), [
      msg(P.admin, 200, [x('占用你 2 分钟，帮我们把食堂变得更好吃一点。问卷本周日截止。', 'Give us 2 minutes and help make the cafeteria a little tastier. The survey closes this Sunday.')]),
    ], { folder: 'trash' }),
  ];

  const INCOMING: MailData['INCOMING'] = [
    {
      subject: x('评审会改到周四 15:00', 'Review moved to Thursday 3:00 PM'), from: P.lin, labels: ['work'],
      body: [x('“松果”会议室 14:00 被占了，评审会顺延一小时，地点不变。日历邀请已更新。', 'The “Pinecone” room is taken at 2:00 PM, so the review moves back an hour. Same room. The calendar invite has been updated.')],
    },
    {
      subject: x('构建恢复：web-app #4823（main）', 'Build fixed: web-app #4823 (main)'), from: P.ci, labels: ['notice'],
      body: [x('流水线 web-app #4823 全部通过，修复提交：b71d0aa「合计金额保留两位小数」。', 'Pipeline web-app #4823 passed. Fixed by commit b71d0aa “Keep two decimal places in totals”.')],
    },
    {
      subject: x('合同修订版已发，请查收', 'Revised contract sent'), from: P.vendor, labels: ['work', 'finance'],
      body: [x('顾先生，修订版已按 0.3%/日、上限 15% 调整，另外补充了验收标准的附件，请查收。', 'Hi Grace, the revised version reflects 0.3% per day with a 15% cap, and I’ve attached the acceptance criteria as well. Please take a look.')],
    },
  ];

  /* ---------------------------------------------------------------- 文字和时间 */

  const blockText = (b: Block): string => {
    if (typeof b === 'string') return b;
    if ('quote' in b) return b.quote;
    return b.list.join(x('；', '; '));
  };
  const messageText = (m: Message) => m.body.map(blockText).join(' ');
  const snippetOf = (m: Mail) => messageText(lastMessage(m)).replace(/\s+/g, ' ').slice(0, 120);

  function counterpart(m: Mail): { person: Person; prefix: string } {
    const last = lastMessage(m);
    if (last.from.email !== ME.email) return { person: last.from, prefix: '' };
    const other = [...m.messages].reverse().find((y) => y.from.email !== ME.email)?.from;
    if (other && m.folder !== 'sent' && m.folder !== 'drafts') return { person: other, prefix: '' };
    return { person: last.to[0] ?? ME, prefix: m.folder === 'drafts' ? x('草稿 · ', 'Draft · ') : x('发给 ', 'To ') };
  }

  const pad = (n: number) => String(n).padStart(2, '0');
  const WEEK = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const startOfDay = (t: number) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };
  // 英文用 Intl（这个示例只在浏览器里渲染，不用担心构建机和访客的时区、实现不一致）
  const enTime = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' });
  const enWeekday = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
  const enDay = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
  const enFull = new Intl.DateTimeFormat('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

  function shortTime(at: number): string {
    const d = new Date(at);
    const days = Math.round((startOfDay(Date.now()) - startOfDay(at)) / (24 * HOUR));
    if (days <= 0) return en ? enTime.format(d) : `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    if (days === 1) return x('昨天', 'Yesterday');
    if (days < 7) return en ? enWeekday.format(d) : WEEK[d.getDay()];
    return en ? enDay.format(d) : `${d.getMonth() + 1}月${d.getDate()}日`;
  }
  function fullTime(at: number): string {
    const d = new Date(at);
    if (en) return enFull.format(d);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${WEEK[d.getDay()]} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  return {
    lang, FOLDERS, LABELS, ACCENT_SWATCHES, ME, CONTACTS, SEED, INCOMING,
    SIGNATURE: en ? '\n\n—\nGrace Moore\nProduct & Engineering' : '\n\n—\n顾南乔\n产品研发部',
    NO_SUBJECT, folderName, labelOf, viewName, messageText, snippetOf, counterpart, shortTime, fullTime,
  };
}

const DATA: Record<Lang, MailData> = { zh: buildData('zh'), en: buildData('en') };
/** 当前语言的文件夹、联系人、假邮件和格式化函数 */
export const useMail = (): MailData => DATA[useLang()];

/* ------------------------------------------------------------------ 与语言无关的小工具 */

export const lastMessage = (m: Mail) => m.messages[m.messages.length - 1];
export const mailTime = (m: Mail) => lastMessage(m).at;
export const hasAttachment = (m: Mail) => m.messages.some((x) => x.attachments && x.attachments.length > 0);
export const isoTime = (at: number) => new Date(at).toISOString();

let uid = 0;
export const newId = (prefix: string) => `${prefix}-new-${++uid}`;

/** 写邮件的草稿 */
export interface Draft { to: Person[]; subject: string; body: string; files: Array<{ name: string; size: string }> }
export const EMPTY_DRAFT: Draft = { to: [], subject: '', body: '', files: [] };
export const draftDirty = (d: Draft, initial: Draft) =>
  d.subject !== initial.subject || d.body !== initial.body || d.files.length !== initial.files.length
  || d.to.map((x) => x.email).join() !== initial.to.map((x) => x.email).join();

export function fileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export interface MailSettings {
  density: 'comfortable' | 'compact';
  showSnippet: boolean;
  conversation: boolean;
  notify: boolean;
  /** 发送 / 归档后“撤销”保留几秒 */
  undoSeconds: string;
  /** 写邮件的快捷键 */
  composeKey: string;
  signature: boolean;
}
export const DEFAULT_SETTINGS: MailSettings = { density: 'comfortable', showSnippet: true, conversation: true, notify: true, undoSeconds: '8', composeKey: 'C', signature: true };
