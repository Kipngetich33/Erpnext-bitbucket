frappe.ui.form.on("Issue", {
	onload: function(frm) {
		frm.email_field = "raised_by";
	},

	refresh: function(frm) {
		if(frm.doc.status!=="Closed") {
			frm.add_custom_button(__("Close"), function() {
				frm.set_value("status", "Closed");
				frm.save();
			});
		} else {
			frm.add_custom_button(__("Reopen"), function() {
				frm.set_value("status", "Open");
				frm.save();
			});
		}
	},

	timeline_refresh: function(frm) {
		// create button for "Help Article"
		if(frappe.model.can_create('Help Article')) {
			// Removing Help Article button if exists to avoid multiple occurance
			frm.timeline.wrapper.find('.comment-header .asset-details .btn-add-to-kb').remove();
			$('<button class="btn btn-xs btn-link btn-add-to-kb text-muted hidden-xs pull-right">'+
				__('Help Article') + '</button>')
				.appendTo(frm.timeline.wrapper.find('.comment-header .asset-details:not([data-communication-type="Comment"])'))
				.on('click', function() {
					var content = $(this).parents('.timeline-item:first').find('.timeline-item-content').html();
					var doc = frappe.model.get_new_doc('Help Article');
					doc.title = frm.doc.subject;
					doc.content = content;
					frappe.set_route('Form', 'Help Article', doc.name);
				});
		}

		if (!frm.timeline.wrapper.find('.btn-split-issue').length) {
			let split_issue = __("Split Issue")
			$(`<button class="btn btn-xs btn-link btn-add-to-kb text-muted hidden-xs btn-split-issue pull-right" style="display:inline-block; margin-right: 15px">
				${split_issue} 
			</button>`)
				.appendTo(frm.timeline.wrapper.find('.comment-header .asset-details:not([data-communication-type="Comment"])'))
			if (!frm.timeline.wrapper.data("split-issue-event-attached")){
				frm.timeline.wrapper.on('click', '.btn-split-issue', (e) => {
					var dialog = new frappe.ui.Dialog({
						title: __("Split Issue"),
						fields: [
							{fieldname: 'subject', fieldtype: 'Data', reqd:1, label: __('Subject'), description: __('All communications including and above this shall be moved into the new Issue')}
						],
						primary_action_label: __("Split"),
						primary_action: function() {
							frm.call("split_issue", {
								subject: dialog.fields_dict.subject.value,
								communication_id: e.currentTarget.closest(".timeline-item").getAttribute("data-name")
							}, (r) => {
								let url = window.location.href
								let arr = url.split("/");
								let result = arr[0] + "//" + arr[2]
								frappe.msgprint(`New issue created: <a href="${result}/desk#Form/Issue/${r.message}">${r.message}</a>`)
								frm.reload_doc();
								dialog.hide();
							});
						}
					});
					dialog.show()
				})
				frm.timeline.wrapper.data("split-issue-event-attached", true)
			}
		}
	}
});

// =================================================================================================

// global variables
var field_to_hide_unhide = {
	leak_report: ["location","leak_assessment",
				"condition_of_fitting","leak_repair","section_break_40",
				"materials_used_for_repair","remarks","section_break_25"
	],
	other: [],
	all: [
		"location","leak_assessment",
		"condition_of_fitting","leak_repair","section_break_40",
		"materials_used_for_repair","remarks","section_break_25"
	],
}

// function that hides or unhides certain fields on refresh
function hide_unhide_on_refresh(frm) {
	console.log("On refresh")
	if (frm.doc.issue_type == "Leak Report") {
		hide_function(frm, field_to_hide_unhide, "leak_report")
	}
	else if (frm.doc.issue_type == "Other") {
		hide_function(frm, field_to_hide_unhide, "other")
	}
	else {
		hide_function(frm, field_to_hide_unhide, "none")
	}

	function hide_function(frm, field_to_hide_unhide, issue_type) {
		var hide_fields = field_to_hide_unhide["all"]
		var unhide_fields = field_to_hide_unhide[issue_type]
		if (issue_type == "none") {
			hide_unhide_fields(frm, hide_fields, false)
		}
		else {
			hide_unhide_fields(frm, hide_fields, false)
			hide_unhide_fields(frm, unhide_fields, true)
		}
	}

	/*function that hides fields ,called on refresh*/
	function hide_unhide_fields(frm, list_of_fields, hide_or_unhide) {
		for (var i = 0; i < list_of_fields.length; i++) {
			frm.toggle_display(list_of_fields[i], hide_or_unhide)
		}
	}
}


// the code below are custom script
frappe.ui.form.on("Issue", "refresh",function(frm){
	console.log("Refreshing !")
	hide_unhide_on_refresh(frm)
});

// function that runs when the type_of_invoice field is clicked
frappe.ui.form.on("Issue", "issue_type", function (frm) {
	frm.refresh()
})