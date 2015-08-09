var app = require('koa')();
var router = require('koa-router')();
var gzip = require('koa-gzip');
var send = require('koa-send');
var render = require('koa-ejs');

render(app,{
    root:__dirname+'/view',
    layout: 'template',
    viewExt: 'html',
    cache: false,
    debug: true
});

router.get('/', function*(next){
    this.user='ron';
    yield next;
}, function *(next) {

    this.body = Output("欢迎", "Hi, " + this.user)
});

router.get('/help', function*(next){
    this.user='ron';
    yield next;
}, function *(next) {
    var str = "";
    for(var item in this)
    {
        str += ((str == "")?"":"<br/>") + item;
    }


    this.body = Output("帮助", str);
});

router.get('/json', function*(next){
    this.user='ron';
    yield next;
}, function *(next) {
    this.body = {a:1, b:2, c:3, d:this.user};
});

router.get('/file', function*(next){
    try
    {
       var fileName = this.request.querystring;
        if(fileName == "")
        {
            this.body = "请提供资源名称";
        }
        else
        {
            yield send(this, __dirname+"/resources/" + this.request.querystring);
        }
    }
    catch(e)
    {
        this.body = e.toString();
    }
});

router.get('/url', function*(next){
    try
    {
        this.body = Output("参数", this.request.querystring)
    }
    catch(e)
    {
        this.body = e.toString();
    }
});

router.get('/template', function*(next){
    try
    {
        this.users = [{name:"1"},{name:"2"}];
        yield this.render('user');
    }
    catch(e)
    {
        this.body = e.toString();
    }
});

app .use(router.routes())
    .use(router.allowedMethods())
    .listen(3002);


function Output(title, body)
{
    var strOutput = "<!doctype html>";
    strOutput += "<head><title>" + title + "</title></head>";
    strOutput += "<body>" + body + "</body>";

    return strOutput;
}