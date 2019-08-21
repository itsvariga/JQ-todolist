/*
  定义一个域，在这个域里面定义变量就不会造成全局污染
  开头的分号是为了防止上一个代码块没有结束，造成奇怪的错误
*/
;(function () {
  'use strict';
  var $from_add_task = $('.add-task')
    , $task_delete_trigger
    , $task_detail_trigger
    , $task_detail = $('.task-detail')
    , $task_detail_mask = $('.task-detail-mask')
    , task_list = []
    , current_index
    , $update_form
    , $task_detail_content
    , $task_detail_content_input
    ;
  
  init();

  $from_add_task.on('submit', on_add_task_form_submit)
  $task_detail_mask.on('click', hide_task_detail)

  function listen_task_delete() {
    $task_delete_trigger.on('click', function() {
      var $this = $(this);
      var $item = $this.parent().parent();
      var index = $item.data('index');
      var tmp = confirm('确定删除？');
      tmp ? delete_task(index) : null;
    })
  }

  function listen_task_detail() {
    $task_detail_trigger.on('click', function() {
      var $this = $(this);
      var $item = $this.parent().parent();
      var index = $item.data('index');
      show_task_detail(index);
    })
  }

  // 查看task详情
  function show_task_detail(index) {
    render_task_detail(index);
    current_index = index;
    $task_detail.show();
    $task_detail_mask.show();
  }

  function update_task(index, data) {
    if(index === undefined || !task_list[index]) return;
    task_list[index] = data; // $.merge({}, task_list[index], data);
    refresh_task_list();
  }

  function hide_task_detail() {
    $task_detail.hide();
    $task_detail_mask.hide();
  }

  function render_task_detail(index) {
    if (index === undefined || !task_list[index]) return;
    var item = task_list[index]
    var tpl = `
    <form>
      <div class="content">${item.content}</div>
      <div class="input-item">
        <input style="display: none;" type="text" name="content" value="${item.content}">
      </div>
      <div>
        <div class="desc input-item">
          <textarea name="desc">${item.desc || ''}</textarea>
        </div>
      </div>
      <div class="remind input-item">
        <input name="remind_date" type="date" value="${item.remind_date || ''}">
      </div>
      <div class="input-item">
        <button type="submit">更新</button>
      </div>
    </form>
    `;
    $task_detail.html(null);
    $task_detail.html(tpl);
    $update_form = $task_detail.find('form');
    $task_detail_content = $update_form.find('.content')
    $task_detail_content_input = $update_form.find('[name=content]');
    $task_detail_content.on('dblclick', function() {
      $task_detail_content_input.show();
      $task_detail_content.hide();
    })

    $update_form.on('submit', function(e) {
      e.preventDefault();
      var data = {};
      data.content = $(this).find('[name=content]').val();
      data.desc = $(this).find('[name=desc]').val();
      data.remind_date = $(this).find('[name=remind_date]').val();
      // console.log(data)
      update_task(index, data);
      hide_task_detail();
    })
  }

  function add_task(new_task) {
    // 将task推入task_list
    task_list.unshift(new_task);
    refresh_task_list();
    return true;
  }

  function render_task_list () {
    var $task_list = $('.tasks-list');
    // 先清除$tasks_list的html
    $task_list.html('')
    for (var i = 0; i < task_list.length; i++) {
      var $task = render_task_item(task_list[i], i);
      $task_list.append($task)
    }
    $task_delete_trigger = $('.action.delete')
    $task_detail_trigger = $('.action.detail')
    listen_task_delete();
    listen_task_detail();
  }

  function render_task_item (data, index) {
    if (!data || index === undefined) return;
    var list_item_tpl = `
      <div class="task-item" data-index="${index}">
        <span><input type="checkbox"></span>
        <span class="task-content">${data.content}</span>
        <span class="fr">
          <span class="action delete"> 删除</span>
          <span class="action detail"> 详细</span>
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
  // 更新localStorage数据并更新tpl
  function refresh_task_list() {
    store.set('task_list', task_list);
    render_task_list();
  }

  function delete_task(index) {
    if (index === undefined || !task_list[index]) return;
    task_list.splice(index, 1)
    refresh_task_list();
    if (!task_list.length) {
      store.remove('task_list');
      return;
    }
  }

  function on_add_task_form_submit(e) {
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
      $input.val(null);
    }
  }
})();