export class Include{
    constructor(){
        this.$main = document.getElementsByTagName('MAIN')[0];
    }//constructor

    async init(list){
        if(list.length <= 0){return;}
        for(let season of list){
            const $sect = this.make_section(season);
            this.$main.appendChild($sect);
            const $frag = document.createDocumentFragment();
            
            const data = await this.include_json(season);

            //제목 만들고
            this.make_season_title($frag, data);

            //테이블 만들고
            data.episode.forEach((ep,idx)=>{
                this.make_tbls($frag,ep,idx,data.season);
            });

            //최종 추가
            $sect.appendChild($frag);
        }
    }//init

    make_section(season){
        const $sect = document.createElement('SECTION');
        $sect.classList.add('season', season);
        return $sect;
    }//make_section

    make_season_title($frag, data){
        const $h2 = document.createElement('H2');
        $h2.innerHTML = `시즌 ${String(data.season).padStart(2,"0")} : 총 에피소드 <strong>${data.episode.length}</strong>개`;
        $frag.appendChild($h2);
    }//make_season_title

    include_json(season){
        const url = `./json/${season}.json`;
        return fetch(url).then(res=>res.json());
    }//include_json

    /* 테이블 만들기 */
    make_tbls($frag,ep,idx,season){
        const $tbl = document.createElement('TABLE');
        $tbl.classList.add('tbl');
        const $fragTbl = document.createDocumentFragment();

        //caption
        const $caption = this.make_caption(season,idx);
        $fragTbl.appendChild($caption);
        
        //colgroup
        const $colgroup = this.make_colgroup();
        $fragTbl.appendChild($colgroup);
        
        //thead
        const $thead = this.make_thead(season,idx,ep);
        $fragTbl.appendChild($thead);

        //tbody
        const $tbody = this.make_tbody(ep);
        $fragTbl.appendChild($tbody);

        //최종 추가
        $tbl.appendChild($fragTbl);
        $frag.appendChild($tbl);
    }//make_tbls

    /* CAPTION */
    make_caption(season,idx){
        const $caption = document.createElement('CAPTION');
        $caption.innerText = get_simple_SE(season,idx); 
        return $caption;
    }//make_caption

    /* COLGROUP */
    make_colgroup(){
        const $colgroup = document.createElement('COLGROUP');
        for(let i=0; i<3; i++){
            const $col = document.createElement('COL');
            if(i<2){$col.style.width = '80px';}
            $colgroup.appendChild($col);
        }
        return $colgroup;
    }//make_colgroup

    /* thead */
    make_thead(season,idx,ep){
        const $thead = document.createElement('THEAD');
        const $tr = document.createElement('TR');
        const cell_1 = get_simple_SE(season,idx);
        const cell_2 = `Chapter ${ep.chapter} : ${ep.title}`;

        add_simple_cell($tr,'TH',cell_1);
        add_simple_cell($tr,'TH',cell_2,{col:2});

        $thead.appendChild($tr);
        return $thead;
    }//make_thead

    /* ✨✨✨✨ tbody */
    make_tbody(ep){
        const $tbody = document.createElement('TBODY');

        this.tr_weapon(ep.weapon,$tbody);
        this.tr_defense(ep.defense,$tbody);
        this.tr_transportation(ep.transportation, $tbody);

        this.tr_story(ep.plot_story, $tbody);
        this.tr_bait(ep.plot_bait, $tbody);
        
        this.tr_relation_good(ep.relation.good, $tbody);
        this.tr_relation_soso(ep.relation.soso, $tbody);
        this.tr_relation_bad(ep.relation.bad, $tbody);

        this.tr_p_grogu(ep.point_grogu, $tbody);
        this.tr_p_dindjarin(ep.point_dindjarin, $tbody);

        return $tbody;
    }//make_tbody

    /* 공격 */
    tr_weapon(weapon, $tbody){
        const $tr = document.createElement('TR');
        //소유
        add_simple_cell($tr,"TH",'소유',{row:3});
        
        //공격-th
        add_simple_cell($tr,"TH",'공격');

        //공격-td
        const $frag = document.createDocumentFragment();
        weapon.forEach(obj => {
            const $span = add_lbl(obj);
            $span.classList.toggle('used',obj.used);
            $frag.appendChild($span);
        });
        add_frag_cell($tr,"TD",$frag);

        //최종 추가
        $tbody.appendChild($tr);
    }//tr_weapon

    /* 방어 */
    tr_defense(defense, $tbody){
        const $tr = document.createElement('TR');
        add_simple_cell($tr,"TH","방어");

        const $frag = document.createDocumentFragment();
        defense.forEach(obj => {
            const $span = add_lbl(obj);
            $frag.appendChild($span);
        });
        add_frag_cell($tr,"TD",$frag);
        //최종
        $tbody.appendChild($tr);
    }//tr_defense
    
    /* 이동수단 */
    tr_transportation(transportation, $tbody){
        const $tr = document.createElement('TR');
        add_simple_cell($tr,"TH","이동수단");
        
        const $frag = document.createDocumentFragment();
        transportation.forEach(obj => {
            const $span = add_lbl(obj);
            $frag.appendChild($span);
        });
        add_frag_cell($tr,"TD",$frag);

        //최종
        $tbody.appendChild($tr);
    }//tr_transportation
    
    /* 줄거리 */
    tr_story(story, $tbody){
        const $tr = document.createElement('TR');
        add_simple_cell($tr,"TH","플롯",{row:2});
        add_simple_cell($tr,"TH","줄거리");

        const $frag = document.createDocumentFragment();
        story.forEach(item => {
            const $p = document.createElement('P');
            $p.innerText = item;
            $frag.appendChild($p);
        });
        add_frag_cell($tr,"TD",$frag);
        //최종
        $tbody.appendChild($tr);
    }//tr_story
    
    /* 떡밥 */
    tr_bait(bait, $tbody){
        const $tr = document.createElement('TR');
        add_simple_cell($tr,"TH","떡밥");

        const $frag = document.createDocumentFragment();
        bait.forEach(obj => {
            add_time(obj,$frag);
        });
        add_frag_cell($tr,"TD",$frag);
        
        //최종
        $tbody.appendChild($tr);
    }//tr_bait
    
    /* 관계 - 우호 */
    tr_relation_good(good, $tbody){
        const $tr = document.createElement('TR');
        add_simple_cell($tr,"TH","인간관계",{row:3});
        add_simple_cell($tr,"TH","우호");

        const $frag = document.createDocumentFragment();
        good.forEach(obj=>{
            add_people(obj,$frag,"good");
        });
        add_frag_cell($tr,"TD",$frag);

        //최종
        $tbody.appendChild($tr);
    }//tr_relation_good
    
    /* 관계 - 중립 */
    tr_relation_soso(soso, $tbody){
        const $tr = document.createElement('TR');
        add_simple_cell($tr,"TH","중립");
        
        const $frag = document.createDocumentFragment();
        soso.forEach(obj=>{
            add_people(obj,$frag);
        });
        add_frag_cell($tr,"TD",$frag);

        //최종
        $tbody.appendChild($tr);
    }//tr_relation_soso
    
    /* 관계 - 적대 */
    tr_relation_bad(bad, $tbody){
        const $tr = document.createElement('TR');
        add_simple_cell($tr,"TH","적대");
        
        const $frag = document.createDocumentFragment();
        bad.forEach(obj=>{
            add_people(obj,$frag,"bad");
        });
        add_frag_cell($tr,"TD",$frag);

        //최종
        $tbody.appendChild($tr);
    }//tr_relation_bad
    
    /* 포인트 - 그로구 */
    tr_p_grogu(grogu, $tbody){
        const $tr = document.createElement('TR');
        add_simple_cell($tr,"TH","포인트",{row:2});
        add_simple_cell($tr,"TH","그로구");

        const $frag = document.createDocumentFragment();
        grogu.forEach(obj => {add_time(obj,$frag)});
        add_frag_cell($tr,"TD",$frag);

        //최종
        $tbody.appendChild($tr);
    }//tr_p_grogu
    
    /* 포인트 - 딘자린 */
    tr_p_dindjarin(dindjarin, $tbody){
        const $tr = document.createElement('TR');
        add_simple_cell($tr,"TH","딘자린");

        const $frag = document.createDocumentFragment();
        dindjarin.forEach(obj => {add_time(obj,$frag)});
        add_frag_cell($tr,"TD",$frag);
        
        //최종
        $tbody.appendChild($tr);
    }//tr_p_dindjarin
    
}//class-Include

function get_simple_SE(season,idx){
    return `${season}${String(idx+1).padStart(2,"0")}`;
}//get_simple_SE

function add_simple_cell($tr,type,content,opt){
    const $cell = document.createElement(type);
    $cell.innerText = content ?? 'UNDEFINED';
    if(opt?.row){$cell.rowSpan = opt.row;}
    if(opt?.col){$cell.colSpan = opt.col;}
    $tr.appendChild($cell);
}//add_simple_cell

function add_frag_cell($tr,type,frag,opt){
    if(!frag){return;}
    const $cell = document.createElement(type);
    $cell.appendChild(frag);
    if(opt?.row){$cell.rowSpan = opt.row;}
    if(opt?.col){$cell.colSpan = opt.col;}
    $tr.appendChild($cell);
}//add_frag_cell

function add_lbl(obj){
    const $span = document.createElement('SPAN');
    $span.textContent = obj.name;
    $span.classList.add('lbl');
    $span.classList.toggle('cancel',!obj.stat);
    return $span;
}//add_lbl

function add_people(obj,$frag,rel){
    const $p = document.createElement('P');
    const $name = document.createElement('SPAN');
    $name.textContent = obj.name;
    $name.classList.add('char');
    rel && $name.classList.add(rel);
    $p.appendChild($name);

    const $content = document.createTextNode(obj.content || '');
    $p.appendChild($content);

    $frag.appendChild($p);
}//add_people

function add_time(obj,$frag){
    const $p = document.createElement('P');
            
    const $time = document.createElement('SPAN');
    $time.classList.add('timeStamp');
    $time.textContent = obj.time;
    $p.appendChild($time);
    
    const content = document.createTextNode(obj.content);
    $p.appendChild(content);

    $frag.appendChild($p);
}//add_time