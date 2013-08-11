const tmenu        = require('terminal-menu')
    , path         = require('path')
    , fs           = require('fs')
    , EventEmitter = require('events').EventEmitter

const printText = require('./print-text')
    , repeat    = require('./term-util').repeat
    , bold      = require('./term-util').bold

function showMenu (opts) {
  var emitter  = new EventEmitter()
    , menu     = tmenu({ width: opts.width, x: 3, y : 2 })

  menu.reset()
  menu.write(bold(opts.title) + '\n')
  menu.write(repeat('-', opts.width) + '\n')
    
  opts.problems.forEach(function (name, i) {
    var isDone = opts.completed.indexOf(name) >= 0
      , m      = '[COMPLETED]'

    name = name

    if (isDone)
      return menu.add(bold('»') + ' ' + name + Array(63 - m.length - name.length + 1).join(' ') + m)
    else
      menu.add(bold('»') + ' ' + name)
  })

  menu.write(repeat('-', opts.width) + '\n')
  menu.add(bold('HELP'))
  menu.add(bold('EXIT'))
  
  menu.on('select', function (label) {
    var name = label.replace(/(^[^»]+»[^\s]+ )|(\s{2}.*)/g, '')
    
    menu.close()

    if (name === bold('EXIT'))
      return emitter.emit('exit')

    if (name === bold('HELP'))
      return emitter.emit('help')

    emitter.emit('select', name)
  })

  menu.createStream().pipe(process.stdout)
  
  return emitter
}

module.exports = showMenu