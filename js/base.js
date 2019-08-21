/*
  定义一个域，在这个域里面定义变量就不会造成全局污染
  开头的分号是为了防止上一个代码块没有结束，造成奇怪的错误
*/
;(function () {
  'use strict';
  var $from_add_task = $('.add-task')
    , task_list = []
    ;
  
  init();

  $from_add_task.on('submit', function (e) {
    var new_task = {}, $input
    // 禁用默认行为
    e.preventDefault();
    // 获取新task的值
    $input = $(this).find('input[name=content]');
    new_task.content = $(this).find('input[name=content]').val();
    // 如果新task为空 则直接返回 否则直接执行
    if (!new_task.content) return;
    // 存入新task
    if (add_task(new_task)) {
      render_task_list();
      $input.val(null);
    }
  })

  function add_task(new_task) {
    // 将task推入task_list
    task_list.push(new_task);
    // 更新localStorage
    store.set('task_list', task_list);
    return true;
  }

  function render_task_list () {
    var $task_list = $('.tasks-list');
    // 先清除$tasks_list的html
    $task_list.html('')
    for (var i = 0; i < task_list.length; i++) {
      var $task = render_task_tpl(task_list[i]);
      $task_list.append($task)
    }
  }

  function render_task_tpl (data) {
    var list_item_tpl = `
      <div class="task-item">
        <span><input type="checkbox"></span>
        <span class="task-content">${data.content}</span>
        <span class="fr">
          <span class="action"> 删除</span>
          <span class="action"> 详细</span>
        </span>
      </div>
    `
    return list_item_tpl
  } 

  function init() {
    task_list = store.get('task_list') || [];
    if (task_list.length) {
      render_task_list();
    }
  }
})();