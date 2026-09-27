// Original teaching layouts. The examples organize observations, not prescriptions.
export const readingRoutes = `<section class="reading-routes" aria-labelledby="routesTitle">
  <h2 id="routesTitle">从你养的鸟开始读</h2>
  <p>两条路线都保留共同的环境、饮食与急症内容。先看专属提醒，再按顺序完成准备。</p>
  <div class="route-grid">
    <article><h3>我养虎皮</h3><ol><li><a href="#budgie-care">认识小体型与空壳误判</a></li><li><a href="#equipment-guide">验收笼具、栖木与称重工具</a></li><li><a href="#food-observation">确认实际吞咽，记录进食</a></li><li><a href="#return-guide">练习安全回笼</a></li></ol></article>
    <article><h3>我养小太阳</h3><ol><li><a href="#conure-care">认识啃咬、钻洞与相处边界</a></li><li><a href="#equipment-guide">检查门锁、挂扣与用品强度</a></li><li><a href="#food-observation">记录主食与奖励，避免挑食</a></li><li><a href="#return-guide">练习站台与自主回笼</a></li></ol></article>
  </div>
  <p class="route-common">两种鸟都要读：<a href="#safety">放飞安全</a> · <a href="#emergency">急症行动</a> · <a href="#checklists">每日照护与离线版</a></p>
</section>`;

const equipment = `<div class="practical-guide anchor-target" id="equipment-guide">
  <h3>拿着这张验收表，再决定用品是否合适</h3>
  <p>请商家提供内部长、宽、高，栏杆之间的净间距、门缝尺寸和材质。把测量值记下来；不凭商品名里的“小号／中号”判断。下面是验收方法，不是统一尺寸处方。</p>
  <div class="comparison-wrap"><table class="comparison"><caption>虎皮与小太阳：用品验收重点</caption><thead><tr><th scope="col">项目</th><th scope="col">虎皮重点看</th><th scope="col">小太阳重点看</th></tr></thead><tbody>
    <tr><th scope="row">主笼与缝隙</th><td>测量栏距、食盆口与门角；小头和小脚不能卡入危险缝隙。</td><td>检查门锁能否从内部推开，栏杆与焊点能否承受日常攀爬啃咬。</td></tr>
    <tr><th scope="row">内部空间</th><td colspan="2">先规划栖木、盆和玩具的位置，再确认展开双翼、转身与移动不会碰栏或磨尾；纵向高度不能代替横向空间。</td></tr>
    <tr><th scope="row">栖木</th><td>能稳握而不滑落；不要直接拿大鸟用品代替。</td><td>除脚部适配外，定期检查啃坏、劈裂和松动位置。</td></tr>
    <tr><th scope="row">称重</th><td>秤放平、站架稳、归零；用同一设备记录小幅变化。</td><td>站架承重与落脚面积合适，站架不能接触秤以外的物体。</td></tr>
    <tr><th scope="row">玩具与挂扣</th><td>重点看小头、小脚可钻入的孔隙及易吞小件。</td><td>重点看咬开的挂扣、拆下的零件及破损纤维。</td></tr>
  </tbody></table></div>
  <p>无法判断尺寸时，把<strong>物种＋笼具内部尺寸＋栏距实测照片＋布局草图</strong>一起交给接诊兽医或可靠用品顾问核对。不要拿鸟的头、脚去试卡不卡。</p>
  <figure class="diagram"><figcaption>摆放对照：看落粪路径，不只看盆是否放得下</figcaption><div class="placement-grid">
    <div class="placement-example"><h4>需要调整：食水位于正下方</h4><svg viewBox="0 0 280 195" role="img" aria-label="常站栖木的正下方放着食水盆，落粪路径穿过食水位置"><path d="M25 45H255" class="perch-line"/><text x="140" y="28">常站栖木</text><path d="M140 62V124" class="fall-line"/><text x="193" y="98">落粪路径</text><rect x="90" y="139" width="100" height="38" rx="6" class="meal-zone"/><text x="140" y="164">食物 / 水</text></svg><p>常站位置正下方容易被污染；发现落粪、湿水或踩脏立即更换。</p></div>
    <div class="placement-example"><h4>调整后：横向错开位置</h4><svg viewBox="0 0 280 195" role="img" aria-label="食水盆移到侧边，与常站栖木的垂直落粪路径错开"><path d="M25 45H150" class="perch-line"/><text x="95" y="28">常站栖木</text><path d="M85 62V169" class="fall-line"/><text x="85" y="191">底部观察区</text><rect x="159" y="105" width="108" height="38" rx="6" class="meal-zone"/><text x="213" y="130">食物 / 水</text></svg><p>错开后仍需检查其他高位栖木；保留容易取食和移动的路线。</p></div>
  </div><p class="diagram-caption">位置关系示意，不表示笼具尺寸。两种鸟都需要按实际布局验收。</p></figure>
</div>`;

const food = `<div class="practical-guide anchor-target" id="food-observation">
  <h3>把“吃了一点”变成能交接的信息</h3>
  <figure class="diagram"><figcaption>食盆看起来满：先分清里面还剩什么</figcaption><div class="compare-paths">
    <article><h4>有完整谷粒</h4><p>外形完整不等于已经吃进去；需要继续观察鸟是否取食、剥壳和吞咽。</p><p class="decision">下一步：把吞咽与撒落分别记录</p></article>
    <article><h4>多数是裂开的空壳</h4><p>壳片可能仍堆成满盆。检查时与同批未吃过的粮比较，不只从上方远看。</p><p class="decision">下一步：补上熟悉且确实会吃的食物</p></article>
  </div><p class="diagram-caption">这是观察判断图，不是实物鉴定图。颗粒碎屑、撒落物与空壳都不能直接当作吃下的量。</p></figure>
  <ol class="task-steps"><li><strong>提供前：</strong>记录食物名称、时间，干粮与鲜食分盆；新到家的鸟先保留已经吃得懂的可靠食物。</li><li><strong>观察时：</strong>从不打扰的位置看是否真正吞咽；只啃碎、拨弄或站在盆旁都单独说明。</li><li><strong>收拾时：</strong>分别看未吃食物、壳片和撒落物，记下鲜食撤走时间，不把“投放重量－剩余重量”直接称为摄入量。</li><li><strong>交接时：</strong>同时提供体重、排便和精神变化；明显摄入减少时联系医院，不等待填满记录表。</li></ol>
  <details><summary>一份填写示例：怎么记录，才不误导自己？</summary><div class="detail-body"><div class="record-template">记录示例（不是喂食量建议）<br>早晨：提供原来熟悉的主食，换上干净水。<br>观察：看到剥壳并吞咽；新粮只咬碎，暂不计作吃进去。<br>鲜食：单独提供已洗净、切小的彩椒，记录放入和撤走时间。<br>收拾：盆内有空壳，笼底有撒落，无法仅靠称差计算摄入。<br>傍晚：记录精神、排便与是否仍正常取食，异常时及时咨询。</div><p>虎皮和小太阳的食物搭配分别确认；同一份记录格式可以共用，份量和换粮计划不能照搬。</p></div></details>
</div>`;

const weight = `<div class="practical-guide anchor-target" id="weigh-guide"><h3>称重：先固定条件，再看变化</h3>
  <figure class="diagram"><figcaption>四步称重图 · 数字仅表示归零，不是标准体重</figcaption><ol class="operation-strip">
    <li><span class="step-badge">1</span><h4>空站架放稳</h4><p>秤放平；站架不碰桌面、墙或其他支撑物。</p></li>
    <li><span class="step-badge">2</span><h4>按归零 / 去皮</h4><p class="zero-display">0.0 g</p><p>确认站架重量已扣除；按设备实际显示核对。</p></li>
    <li><span class="step-badge">3</span><h4>鸟自主站上来</h4><p>待读数稳定；不要用手扶住鸟或站架读取结果。</p></li>
    <li><span class="step-badge">4</span><h4>记下条件</h4><p>日期、克重、是否进食、排便和精神。比较同一只鸟的连续记录。</p></li>
  </ol></figure><p>还怕秤时先练习接近和站架；生病、喘或虚弱时优先就医，不为得到一条数据追抓。</p></div>`;

const returning = `<div class="practical-guide anchor-target" id="return-guide"><h3>回笼练习：每一步都留出退路</h3>
  <figure class="diagram"><figcaption>自主回笼的进阶路线</figcaption><ol class="operation-strip">
    <li><span class="step-badge">1</span><h4>靠近笼门</h4><p>先有稳定落脚处。愿意靠近就给小份熟悉奖励。</p></li>
    <li><span class="step-badge">2</span><h4>进入门内站位</h4><p>引导自主迈步，不从后面堵、不推胸腹；退开就降低难度。</p></li>
    <li><span class="step-badge">3</span><h4>在里面有好事</h4><p>进入后立即奖励；练习时不必每一次进去都结束活动。</p></li>
    <li><span class="step-badge">4</span><h4>短暂关门再开</h4><p>先在鸟平静时练，再逐渐配合日常作息。时间按接受程度调整。</p></li>
  </ol><p class="diagram-caption">这不是一次必须完成的四个动作。持续惊飞、拒绝奖励或出现不适时停止，先处理环境和健康问题。</p></figure>
</div>`;

export const practicalGuides = {
  home: equipment,
  food,
  health: weight,
  behavior: returning,
};
