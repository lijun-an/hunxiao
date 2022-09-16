
const fs =require("fs")
const parser = require("@babel/parser");
const generate = require("@babel/generator").default;
const traverse=require("@babel/traverse").default;
const types=require("@babel/types");
const code = fs.readFileSync("./参数ua.js", "utf8");
const ast = parser.parse(code);
// 1.解决逗号表达式
const resolveSequence = 
{
  SequenceExpression(path)
  {
    let {scope,parentPath,node} = path;
    let expressions = node.expressions;
    if (parentPath.isReturnStatement({"argument":node}))
    {
      let lastExpression = expressions.pop();
      for (let expression of expressions)
      {
        parentPath.insertBefore(types.ExpressionStatement(expression=expression));
      }
      
      path.replaceInline(lastExpression);
    }
    else if (parentPath.isExpressionStatement({"expression":node}))
    {
      let body = [];
      expressions.forEach(express=>{
            body.push(types.ExpressionStatement(express));
        });
      path.replaceInline(body);
    }
    else
    {
      return;
    }
    
    scope.crawl();
  }
}

traverse(ast,resolveSequence)
const result=generate(ast)
fs.writeFile("./result02.js",result.code,(err) => {
  if(err) console.log("写入失败");
});

