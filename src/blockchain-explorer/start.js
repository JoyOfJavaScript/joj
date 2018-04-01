const params = {
  port: 8181,
  host: '0.0.0.0',
  root: process.cwd() + '/public',
  open: true,
  ignore: 'scss,my/templates',
  wait: 1000,
  // mount: [['/components', './node_modules']],
  logLevel: 1
}

require('live-server').start(params)
