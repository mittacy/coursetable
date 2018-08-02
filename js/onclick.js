// 添加新成员按钮、删除成员以及点击导航栏姓名功能
window.onload = function() {
    let oBtn = document.getElementById("new-member");
    let oDtn = document.getElementById('delete-name');
    let oUl = document.getElementById("members");
    // 点击添加新成员按钮
    oBtn.onclick = function(){
        // 输入新建成员的姓名
        let str = window.prompt("请输入姓名:","");
        // 判断是否已经输入名字，然后新建成员表格滑下显示
        if (str) {
            if (IF_INTRODUCE) {
                document.getElementsByClassName('introduce')[0].className = 'introduce form-hide';
                $("#form1").attr("class", "form-content form-current");
                IF_INTRODUCE = false;
                if (IfImport) {
                    // 添加新成员
                    CURRENTMEMBER = member.length;
                }
            } else {
                // 提交前一个成员的数据并保存数据
                if (IF_FIRST[CURRENTMEMBER] === 1) {
                    changeValue();
                } else {
                    getValue();
                    IF_FIRST[CURRENTMEMBER] = 1;    // 数据写入到userCourses里了
                }
                // 添加新成员
                CURRENTMEMBER = member.length;
            }
            // 交换表格并清掉数据
            changeForm();
            INPUT_NAME.value = str;
            // 向导航栏添加成员并赋予功能
            let oLi = document.createElement('li');
            oLi.innerHTML = str;
            oLi.className = "member";
            oUl.appendChild(oLi);
            clickNav();
            // 新建对象
            member[CURRENTMEMBER] = str;
        }
    };
    // 点击删除成员按钮
    oDtn.onclick = function(){
        if (!IF_INTRODUCE) {
            if (confirm('确定要删除该成员？？？')) {
                // 更换表格
                if (CURRENTMEMBER > 0 || member.length > 1) {
                    // 更换页面表格
                    changeForm();
                } else if (CURRENTMEMBER === 0) {
                    // 清空表格数据
                    for (let m = 0; m < 2; m++ ){
                        for(let x = 0; x < 7; x++) {
                            for (let j = 0; j < 6; j++) {
                                let m = j + x * 6;
                                document.getElementsByClassName('once-tex')[m].value = [];
                            }
                        }
                    }
                    $("#form1").attr("class", "form-content form-hide");
                    $("#form2").attr("class", "form-content form-hide");
                    // 姓名框变成即将展示的成员姓名
                    let IF_INTRODUCE = true;
                }
                // 清除已经提交到userCourse的数据和保存的成员输入数据
                if (IF_FIRST[CURRENTMEMBER] === 1) {
                    let w = CURRENTMEMBER * 42;
                    userCourses.splice(w, 42);
                    member_star.splice(w, 42);
                    member_end.splice(w, 42);
                    member_else.splice(w, 42);
                }
                // 清除导航栏的该成员的li标签
                $("#members li:eq(" + CURRENTMEMBER + ")").remove();
                // 清除当前成员
                member.splice(CURRENTMEMBER,1);
                IF_FIRST.splice(CURRENTMEMBER,1);
                // 姓名框变成即将展示的成员姓名（最后一个成员）
                CURRENTMEMBER = member.length - 1;
                INPUT_NAME.value =  member[CURRENTMEMBER] || '姓名';
                // 导入要显示的成员的数据
                if (!IF_INTRODUCE) {
                    importValue();
                }
                clickNav();
            }
        }
    }
};

// 计算空课表按钮功能
function NoCourseTable() {
    if (!IF_INTRODUCE || IfImport) {
        IfImport = false;
        if (IF_FIRST[CURRENTMEMBER] === 1) {
            changeValue();
        } else {
            getValue();
            IF_FIRST[CURRENTMEMBER] = 1;
        }
        // 清空表格数据
        for (let w = 0; w < 2; w++) {
            for (let x = 0; x < 7; x++ ) {
                for (let j = 0; j < 6; j++) {
                    let m = j + x * 6 + w * 42;
                    document.getElementsByClassName('course-star')[m].value = '';
                    document.getElementsByClassName('course-end')[m].value = '';
                    document.getElementsByClassName('course-else')[m].value = '';
                }
            }
        }
        CURRENTMEMBER = member.length - 1;
        // 将userCourse所有数据写入课表COURSETABLES
        userCourses.forEach(userCourse => {
            userCourse.noneCourseWeeks.forEach(week => {
              COURSETABLES[week - 1][userCourse.courseId][userCourse.weekday].push(userCourse.user);
            })
        })
        let choiceweek = document.getElementById('choice-week').selectedIndex;
        for (let x = 0; x < 7; x++) {
            for (let j = 0; j < 6; j++) {
                let m1 = j + x * 6;
                document.getElementsByClassName('once-tex')[m1].innerHTML = COURSETABLES[choiceweek][j][x];
            }
        }
        document.getElementById('all_input').style.top = '-650px';
        document.getElementById('all_input').style.display = 'none';
        document.getElementById('none-course').style.display = 'block';
        document.getElementById('none-course').style.opacity = 1;
        uniteHeight(0);
    }
}

// 返回输入页面按钮
function backInput() {
    document.getElementById('none-course').style.opacity = 0;
    document.getElementById('none-course').style.display = 'none';
    document.getElementById('all_input').style.display = 'block';
    document.getElementById('all_input').style.top = '0px';
    changeForm();
    importValue();
    INPUT_NAME.value = member[CURRENTMEMBER];
    deleteDate();
}

// 选择展示周
function mySelect() {
    let sel_button = document.getElementById('choice-week');
    let my_select = sel_button.selectedIndex;
    if ($('#week1').is('.week-current') == true) {
        // 清空表格数据并写入新的数据
        for (let x = 0; x < 7; x++ ) {
            for (let j = 0; j < 6; j++) {
                let m1 = j + x * 6;
                let m2 = j + x * 6 + 42;
                document.getElementsByClassName('once-tex')[m1].innerHTML = '';
                document.getElementsByClassName('once-tex')[m2].innerHTML = COURSETABLES[my_select][j][x];
            }
        }
        $("#week1").attr("class", "fianll-table week-hide");
        $("#week2").attr("class", "fianll-table week-current");
        uniteHeight(1);
    } else if ($('#week2').is('.week-current') == true) {
        $("#week2").attr("class", "fianll-table week-hide");
        $("#week1").attr("class", "fianll-table week-current");
        // 清空表格数据并写入新的数据
        for (let x = 0; x < 7; x++ ) {
            for (let j = 0; j < 6; j++) {
                let m1 = j + x * 6;
                let m2 = j + x * 6 + 42;
                document.getElementsByClassName('once-tex')[m2].innerHTML = '';
                document.getElementsByClassName('once-tex')[m1].innerHTML = COURSETABLES[my_select][j][x];
            }
        }
        uniteHeight(0);
    }
}