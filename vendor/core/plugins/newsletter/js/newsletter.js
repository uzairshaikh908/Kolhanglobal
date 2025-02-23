$(function () {
  var e = $("#newsletter-popup"),
    t = function (e) {
      var t = new Date();
      t.setTime(t.getTime() + e),
        (document.cookie = "newsletter_popup=1; expires=".concat(
          t.toUTCString(),
          "; path=/"
        ));
    };
  if (e.length > 0) {
    -1 === document.cookie.indexOf("newsletter_popup=1") &&
      setTimeout(function () {
        e.modal("show");
      }, 1e3 * e.data("delay")),
      e
        .on("show.bs.modal", function () {
          var t = e.find(".modal-dialog");
          t.css(
            "margin-top",
            Math.max(0, ($(window).height() - t.height()) / 2) / 2
          );
        })
        .on("hide.bs.modal", function () {
          e.find("form").find('input[name="dont_show_again"]').is(":checked")
            ? t(2592e5)
            : t(36e5);
        }),
      document.addEventListener("newsletter.subscribed", function () {
        return t();
      });
    var n = function (e) {
        $(".newsletter-error-message").html(e).show();
      },
      o = function (e) {
        var t = "";
        $.each(e, function (e, n) {
          "" !== t && (t += "<br />"), (t += n);
        }),
          n(t);
      };
    $(document).on("submit", "form.bb-newsletter-popup-form", function (t) {
      t.preventDefault();
      var s = $(t.currentTarget),
        r = s.find("button[type=submit]");
      $(".newsletter-success-message").html("").hide(),
        $(".newsletter-error-message").html("").hide(),
        $.ajax({
          type: "POST",
          cache: !1,
          url: s.prop("action"),
          data: new FormData(s[0]),
          contentType: !1,
          processData: !1,
          beforeSend: function () {
            return r.prop("disabled", !0).addClass("btn-loading");
          },
          success: function (t) {
            var o = t.error,
              r = t.message;
            o
              ? n(r)
              : (s.find('input[name="email"]').val(""),
                (function (e) {
                  $(".newsletter-success-message").html(e).show();
                })(r),
                document.dispatchEvent(
                  new CustomEvent("newsletter.subscribed")
                ),
                setTimeout(function () {
                  e.modal("hide");
                }, 5e3));
          },
          error: function (e) {
            var t;
            void 0 !== (t = e).errors && t.errors.length
              ? o(t.errors)
              : void 0 !== t.responseJSON
              ? void 0 !== t.responseJSON.errors
                ? 422 === t.status && o(t.responseJSON.errors)
                : void 0 !== t.responseJSON.message
                ? n(t.responseJSON.message)
                : $.each(t.responseJSON, function (e, t) {
                    $.each(t, function (e, t) {
                      n(t);
                    });
                  })
              : n(t.statusText);
          },
          complete: function () {
            "undefined" != typeof refreshRecaptcha && refreshRecaptcha(),
              r.prop("disabled", !1).removeClass("btn-loading");
          },
        });
    });
  }
});
