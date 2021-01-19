import React from "react";
import { Textarea } from "@chakra-ui/react";
import { List, ListItem, UnorderedList } from "@chakra-ui/react";

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
      <div className="w-full mb-12">
        <div className="my-4">
          <div className="mb-2 text-lg font-semibold">
            使用方法：
          </div>
          
          1. 任意のスレッドを開く <br></br>
          2. 「Ctrl + A」で全範囲を選択してコピーする<br></br>
          3. 以下にペースト <br></br><br></br>
          なにかありましたら、
          <a className="text-blue-500" href="https://twitter.com/hukurouo_code" target="_blank" rel="noopener noreferrer">@hukurouo_code</a> までお願いします。
          
        </div>
        <form onSubmit={this.handleSubmit}>
          <Textarea
            mb="8"
            placeholder="Here is a sample placeholder"
            value={this.state.value}
            onChange={this.handleChange}
          />
        </form>
        <div>
          {this.state.result.map((res, index) => {
            return (
              <List key={index} className="mb-2">
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
  const content = (
    <div className="border-l-4 pl-4">
      {res.content.map((cont: string, index: number) => {
        return <div key={index}>{cont}</div>;
      })}
      <div className="text-gray-300 text-xs">ID: {res.header.slice(0, 5)}</div>
    </div>
  );
  return <ListItem ml={props.res.nest * 8}>{content}</ListItem>;
}

function iikanzi(text: string) {
  console.log(text);
  const splitText = text.split("\n").filter((x) => x !== "");
  console.log(splitText);
  let resArray = [];
  let resNum = 1;
  let res = { num: "", header: "", to: "", nest: 0, content: [] };
  let nests = {};
  const isAnchor = (val: string) => /(>>)(\d{1,})/.test(val);
  const isheader = (val: string) =>
    /(\d.+\d{4}\/\d{2}\/\d{2}\(.\) \d{2}:\d{2}:\d{2}.\d{2})/.test(val);
  splitText.forEach((e) => {
    if (isheader(e)) {
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
      res.to = e.split(">>")[1];
    } else {
      res.content.push(e);
    }
  });
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
    currentNestRes.forEach((res) => {
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
  console.log(resArray);
  console.log(result);
  return result;
}
