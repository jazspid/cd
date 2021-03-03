<!DOCTYPE html>
<head>
    <meta charset="UTF-8">
    <title>记事本</title>
    <link rel="stylesheet" href="materialize/css/materialize.css">
    <link href="mdi/css/materialdesignicons.min.css" media="all" rel="stylesheet" type="text/css">
    <script src="jquery.min.js" type="text/javascript"></script>
    <script src="materialize/js/materialize.js"></script>
    <?php
    require("pdo/Db.class.php");
    $db = new Db();
    ?>
</head>
<body>
<?php
//处理请求
$query_prepare = function ($str) {
    return htmlspecialchars(stripslashes(trim($str)));
};
//防xss，嗐
$query_str_delete = "DELETE FROM RECORDS WHERE ID= :id";
$query_str_insert = "INSERT INTO RECORDS (TITLE,TEXT) VALUES (:title,:text)";
$query_str_update = "UPDATE RECORDS SET TITLE=:title, TEXT=:text WHERE ID=:id";
$query_str_select = "SELECT * FROM RECORDS";
if (isset($_POST) and array_key_exists("action", $_POST) and array_key_exists("id", $_POST)) {
    if ($_POST["action"] == "delete") {
        $db->query($query_str_delete, array("id" => $query_prepare($_POST["id"])));
    }
    if ($_POST["action"] == "edit") {
        if (array_key_exists("title", $_POST) and array_key_exists("text", $_POST)) {
            if (intval($_POST["id"]) == 0) {
                $db->query($query_str_insert, array("title" => $query_prepare($_POST["title"]), "text" => $query_prepare($_POST["text"])));
            } else {
                $db->query($query_str_update, array("title" => $query_prepare($_POST["title"]), "text" => $query_prepare($_POST["text"]), "id" => $query_prepare($_POST["id"])));
            }
        }
    }
}
if (isset($_GET) and array_key_exists("q", $_GET)) {
    $q_string = $query_prepare($_GET["q"]);
    $q_array = explode(" ", $q_string);
    $query_str = "$query_str_select WHERE 1";
    foreach ($q_array as $index => $value) {
        $query_str = "$query_str AND LOCATE(:$index ,CONCAT(TEXT,TITLE)) ";
    }
    $nb = $db->query($query_str, $q_array);
} else {
    $q_string = "";
    $nb = $db->query($query_str_select);
}
?>
<div class="container">
    <div class="fixed-action-btn" id="new">
        <a class="btn-floating btn-large red waves-effect">
            <i class="mdi mdi-plus"></i>
        </a>
    </div>
    <div class="navbar-fixed">
        <nav>
            <div class="nav-wrapper">
                <form>
                    <div class="input-field">
                        <input id="search" type="search" placeholder="在标题和内容中查找……" onsearch="search_q()">
                        <label class="label-icon " for="search"><i class="mdi mdi-magnify"></i></label>
                    </div>
                </form>
            </div>
        </nav>
    </div>
    <script>
        var nb
        nb =<?php
        echo json_encode($nb)
        ?>;
        $("#search").val("<?php echo $q_string?>")
        all_toggle = function () {
            $(".my-header").toggleClass("hide")
            $("nav").toggleClass("hide")
            $("#records").toggleClass("hide")
            $("#editor").toggleClass("hide")
            $("#new").toggleClass("hide")
        }
        $(document).ready(function () {
            $("nav").css("width", $(".container").css("width"));
            $(".fixed-action-btn").css("right", 23 + ($(window).width() - $(".container").width()) / 2);
            $("#records").toggleClass("hide");
            $('.modal').modal();
        });
        $(window).resize(function () {
            container_width = $(".container").width();
            $("nav").css("width", container_width);
            $(".fixed-action-btn").css("right", 23 + ($(window).width() - $(".container").width()) / 2);
        });
        var fill_title = ""
        var fill_text = ""
    </script>
    <h4 class="my-header">记事本</h4>
    <h5 class="my-header">搜索到<?php echo count($nb); ?>条记录</h5>
    <div id="records" class="hide">
        <?php
        foreach ($nb as $index => $dict) {
            echo '
                <div class="row" id="rec-' . $dict['ID'] . '">
                    <div class="col s12 m12 l12">
                        <div class="card">
                            <div class="card-content">
                                <span class="card-title">' . $dict['TITLE'] . '</span>
                                <hr>
                                <p>' . $dict['TEXT'] . '</p>
                            </div>
                            <div class="card-action">
                                <a class="mdi mdi-pencil rec-edit" href="#">修改</a>
                                <a class="mdi mdi-delete rec-delete" href="#modal-delete">删除</a>
                           </div>
                        </div>
                    </div>
                </div>';
        }
        ?>
    </div>
    <div id="editor" class="hide">
        <div class="col s12 m12 l12">
            <div class="card">
                <div class="card-content">
                    <span class="card-title">
                        <div class="input-field">
                            <input type="text" placeholder="标题"
                                   style="font-size: xx-large;text-align: center;font-weight: bold" id="input-title">
                        </div>
                    </span>
                    <p>
                    <div class="input-field">
                        <textarea placeholder="正文" class="materialize-textarea" style="font-size: large"
                                  id="input-text">    </textarea>
                    </div>
                    </p>
                </div>
                <div class="card-action right-align">
                    <a class="waves-effect waves-light btn mdi mdi-arrow-left" id="back">返回</a>
                    <a class="waves-effect waves-light btn mdi mdi-content-save save-yes">保存</a>
                    <a class="waves-effect waves-light btn mdi mdi-delete" href="#modal-delete">删除</a>
                </div>
            </div>
        </div>
    </div>
    <div id="modal-delete" class="modal">
        <div class="modal-content">
            <h4>确定删除这条记录？</h4>
        </div>
        <div class="modal-footer">
            <a href="#" class=" modal-action modal-close waves-effect waves-red btn-flat" id="delete-yes">确定</a>
            <a href="#" class=" modal-action modal-close waves-effect waves-green btn-flat">取消</a>
        </div>
    </div>
    <div id="modal-unsave" class="modal">
        <div class="modal-content">
            <h4>是否保存修改？</h4>
        </div>
        <div class="modal-footer">
            <a href="#" class=" modal-action modal-close waves-effect waves-green btn-flat save-yes">保存</a>
            <a href="#" class=" modal-action modal-close waves-effect waves-red btn-flat save-no">不保存</a>
            <a href="#" class=" modal-action modal-close waves-effect waves-purple btn-flat">取消</a>
        </div>
    </div>
</div>
<script>
    var edit_id = 0
    $("#new").click(function () {
        all_toggle()
        edit_id = 0
        fill_title = ""
        fill_text = ""
        $("#input-title").val("")
        $("#input-text").val("")
        $("#input-text").trigger("autoresize")
        $("#delete").addClass("disabled")
    });
    $(".save-no").click(function () {
        all_toggle()
        edit_id = 0
        fill_title = ""
        fill_text = ""
    })
    $("#back").click(function () {
        if ($("#input-title").val() == fill_title && $("#input-text").val() == fill_text) {
            all_toggle()
            edit_id = 0
        } else {
            $("#modal-unsave").modal("open")
        }
    });
    $(".rec-edit").click(function () {
        all_toggle()
        edit_id = Number($(this).parent().parent().parent().parent().attr("id").substring(4))
        for (rec in nb) {
            if (nb[rec]["ID"] == edit_id) {
                fill_title = nb[rec]["TITLE"]
                fill_text = nb[rec]["TEXT"]
            }
        }
        $("#input-title").val(fill_title)
        $("#input-text").val(fill_text)
        $("#input-text").trigger("autoresize")
        $("#delete").removeClass("disabled")

    })
    $(".rec-delete").click(function () {
        edit_id = Number($(this).parent().parent().parent().parent().attr("id").substring(4))
    })
    $("#delete-yes").click(function () {
        $.post("notebook.php", {id: edit_id, action: "delete"}, function (data, status) {
            if (status == "success") {
                Materialize.toast('删除成功！', 1000, "", function () {
                    window.location.assign("notebook.php")
                })
            } else {
                Materialize.toast('删除失败！', 4000)
            }
        })
    })
    $(".save-yes").click(function () {
        if ($("#input-title").val() == fill_title && $("#input-text").val() == fill_text) {
            Materialize.toast('未修改！', 4000)
        } else {
            if ($("#input-title").val() == "") {
                $("#input-title").val("无题")
            }
            $.post("notebook.php", {
                id: edit_id,
                action: "edit",
                title: $("#input-title").val(),
                text: $("#input-text").val()
            }, function (data, status) {
                if (status == "success") {
                    Materialize.toast("保存成功！", 1000, "", function () {
                        window.location.assign("notebook.php")
                    })
                } else {
                    Materialize.toast('保存失败！', 4000)
                }
            })
        }
    })
    $("#search").keydown(function (event) {
        if ($(this).val()) {
            if (event.which == 13) {
                window.location.assign("notebook.php?q=" + $(this).val())
            }
        }
    })
    search_q = function () {
        if ($("#search").val()) {
            window.location.assign("notebook.php?q=" + $("#search").val())
        }
    }
</script>
</body>


