import React from "react";
import { Textarea } from "@chakra-ui/react";
import { List, ListItem, UnorderedList } from "@chakra-ui/react";
import isUrl from 'is-url'

type inputFormType = {
  value: string;
  result: any;
};

class inputForm extends React.Component<{}, inputFormType> {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      result: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
    setTimeout(() => {
      const result = iikanzi(this.state.value);
      this.setState({ result: result });
    }, 500);
  }

  handleSubmit(event) {
    const result = iikanzi(this.state.value);
    this.setState({ result: result });
    event.preventDefault();
  }

  render() {
    return (
      <div className="mb-12">
        <div className="my-8">
          <div className="mb-2 text-lg font-semibold">
            使用方法：
          </div>
          
          1. 任意のスレを開く <br></br>
          2. 「Ctrl + A」で全範囲を選択してコピーする<br></br>
          3. 以下のテキストエリアにペーストする <br></br><br></br>
          なにかありましたら、
          <a className="text-blue-500" href="https://twitter.com/hukurouo_code" target="_blank" rel="noopener noreferrer">@hukurouo_code</a> までお願いします。
          
        </div>
        <form onSubmit={this.handleSubmit}>
          <Textarea
            mb="8"
            placeholder="ここにペーストしてください"
            value={this.state.value}
            onChange={this.handleChange}
          />
        </form>
        <div>
          {this.state.result.map((res, index) => {
            return (
              <List key={index} className="">
                <ResItem res={res} />
              </List>
            );
          })}
        </div>
      </div>
    );
  }
}

export default inputForm;

function ResItem(props) {
  const res = props.res;
  const borderCSS = "border-l-2 pl-4 ml-4"
  const nest1 = (val: JSX.Element) => <div className={borderCSS}>{val}</div>
  const nest2 = (val) => <div className={borderCSS}><div className={borderCSS}>{val}</div></div>
  const nest3 = (val) => <div className={borderCSS}><div className={borderCSS}><div className={borderCSS}>{val}</div></div></div>
  const nest4 = (val) => <div className={borderCSS}><div className={borderCSS}><div className={borderCSS}><div className={borderCSS}>{val}</div></div></div></div>
  const nest5 = (val) => <div className={borderCSS}><div className={borderCSS}><div className={borderCSS}><div className={borderCSS}><div className={borderCSS}>{val}</div></div></div></div></div>
  const nest6 = (val) => <div className={borderCSS}><div className={borderCSS}><div className={borderCSS}><div className={borderCSS}><div className={borderCSS}><div className={borderCSS}>{val}</div></div></div></div></div></div>
  const nest7 = (val) => <div className={borderCSS}><div className={borderCSS}><div className={borderCSS}><div className={borderCSS}><div className={borderCSS}><div className={borderCSS}><div className={borderCSS}>{val}</div></div></div></div></div></div></div>
  const content = (
    <div className="py-1">
      {res.content.map((cont: string, index: number) => {
        return unitRes(index, cont)
      })}
      <div className="text-gray-300 text-xs"> {res.num} ID: {res.header.slice(0, 5)}</div>
    </div>
  );
  switch (res.nest){
    case 0 : return <ListItem><div className="my-1">{(content)}</div></ListItem>;
    case 1 : return <ListItem>{nest1(content)}</ListItem>;
    case 2 : return <ListItem>{nest2(content)}</ListItem>;
    case 3 : return <ListItem>{nest3(content)}</ListItem>;
    case 4 : return <ListItem>{nest4(content)}</ListItem>;
    case 5 : return <ListItem>{nest5(content)}</ListItem>;
    case 6 : return <ListItem>{nest6(content)}</ListItem>;
    case 7 : return <ListItem>{nest7(content)}</ListItem>;
    default : return <></>
  }
  
}

function unitRes(index:number, content:string){
  const isImage = (val: string) => /(imgur|twimg)(.+)(\.|=)(svg|png|jpg|jpeg|gif)$/.test(val);
  const isImgur = (val: string) => /(imgur)(.+)(\.|=)(svg|png|jpg|jpeg|gif)$/.test(val);
  let thumbnail = content
  if (isImgur(content)) {
    thumbnail = content.includes("jpeg") ? content.slice(0,-5) + 't' + content.slice(-5) : content.slice(0,-4) + 't' + content.slice(-4)
  }
  if(isImage(content)){
    return <span key={index}> <a href={content} target="_blank" rel="noopener"><img className="max-w-xs" src={thumbnail} alt={content} loading="lazy" /></a></span>
  } else if (isUrl(content)) {
    return <div key={index}> <a className="text-blue-500" href={content} target="_blank" rel="noopener">{content}</a></div>
  } else {
    return <div key={index}>{content}</div>
  }
}

function iikanzi(text: string) {
  const splitText = text.split("\n").filter((x) => x !== "");
  let resArray = [];
  let resNum = 1;
  let res = { num: "", header: "", to: "", nest: 0, content: [] };
  let nests = {};
  let now = null;
  const isAnchor = (val: string) => /(>>)(\d{1,})/.test(val);
  const isLastRes = (val:string) => /(\d{1,})(コメント)/.test(val);
  const isheader = (val: string) =>
    /(\d.+\d{4}\/\d{2}\/\d{2}\(.\) \d{2}:\d{2}:\d{2}.\d{2})/.test(val);
  splitText.forEach((e) => {
    if (isheader(e)) {
      //console.log(e)
      const date = e.match(/(\d{4}\/\d{2}\/\d{2})/)[0]
      const time = e.match(/(\d{2}:\d{2}:\d{2})/)[0]
      const tnow = Date.parse(date + " " + time)
      //console.log(tnow)
      if (!now) {
        now = tnow
      } else {
        if (tnow + 15000 < now) {
          return;
        } else {
          now = tnow
        }
      }
      if (res.num) {
        resArray.push(res);
      }
      res = {
        num: String(resNum),
        header: e.split("ID:")[1],
        to: "",
        nest: 0,
        content: [],
      };
      if (!res.header) {
        res.header = "noneID";
      }
      resNum++;
    } else if (isAnchor(e)) {
      res.to = e.split(">>")[1].replace(' ','');
    } else {
      res.content.push(e);
    }
  });
  let lastResRow = 0
  res.content.forEach((e,i)=>{
    if(isLastRes(e)){ lastResRow = i }
  })
  //console.log(lastResRow)
  res.content = res.content.slice(0,1)

  resArray.push(res);
  resArray.forEach((res) => {
    if (res.to == "") {
      res.nest = 0;
      nests[String(res.num)] = 0;
    } else {
      const rootNestNum = nests[res.to];
      res.nest = rootNestNum + 1;
      nests[String(res.num)] = rootNestNum + 1;
    }
  });
  let result = resArray.filter((res) => {
    return res.nest == 0;
  });
  const count = Array(10)
    .fill(null)
    .map((_, i) => i + 1);
  count.forEach((nest) => {
    const currentNestRes = resArray.filter((res) => {
      return res.nest == nest;
    });
    currentNestRes.reverse().forEach((res) => {
      const anchorNum = res.to;
      let index = 0;
      let flg = true;
      while (flg) {
        if (result[index].num === anchorNum) {
          flg = false;
        }
        index = index + 1;
      }

      Array.prototype.splice.apply(result, [index, 0].concat([res]));
    });
  });
  //console.log(resArray);
  //console.log(result);
  return result;
}
