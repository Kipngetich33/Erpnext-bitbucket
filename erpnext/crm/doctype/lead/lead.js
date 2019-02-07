// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt

frappe.provide("erpnext");
cur_frm.email_field = "email_id";

erpnext.LeadController = frappe.ui.form.Controller.extend({
	setup: function() {
		this.frm.fields_dict.customer.get_query = function(doc, cdt, cdn) {
			return { query: "erpnext.controllers.queries.customer_query" } }
	},

	onload: function() {

		if(cur_frm.fields_dict.lead_owner.df.options.match(/^User/)) {
			cur_frm.fields_dict.lead_owner.get_query = function(doc, cdt, cdn) {
				return { query: "frappe.core.doctype.user.user.user_query" }
			}
		}

		if(cur_frm.fields_dict.contact_by.df.options.match(/^User/)) {
			cur_frm.fields_dict.contact_by.get_query = function(doc, cdt, cdn) {
				return { query: "frappe.core.doctype.user.user.user_query" } }
		}
	},

	refresh: function() {
		var doc = this.frm.doc;
		erpnext.toggle_naming_series();
		frappe.dynamic_link = {doc: doc, fieldname: 'name', doctype: 'Lead'}

		if(!doc.__islocal && doc.__onload && !doc.__onload.is_customer) {
			this.frm.add_custom_button(__("Customer"), this.create_customer, __("Make"));
			this.frm.add_custom_button(__("Opportunity"), this.create_opportunity, __("Make"));
			this.frm.add_custom_button(__("Quotation"), this.make_quotation, __("Make"));
		}

		if(!this.frm.doc.__islocal) {
			frappe.contacts.render_address_and_contact(cur_frm);
		} else {
			frappe.contacts.clear_address_and_contact(cur_frm);
		}
	},

	create_customer: function() {
		frappe.model.open_mapped_doc({
			method: "erpnext.crm.doctype.lead.lead.make_customer",
			frm: cur_frm
		})
	},

	create_opportunity: function() {
		frappe.model.open_mapped_doc({
			method: "erpnext.crm.doctype.lead.lead.make_opportunity",
			frm: cur_frm
		})
	},

	make_quotation: function() {
		frappe.model.open_mapped_doc({
			method: "erpnext.crm.doctype.lead.lead.make_quotation",
			frm: cur_frm
		})
	},

	organization_lead: function() {
		if (this.frm.doc.organization_lead == 1) {
			this.frm.set_df_property('company_name', 'reqd', 1);
		} else {
			this.frm.set_df_property('company_name', 'reqd', 0);
		}
	},

	company_name: function() {
		if (this.frm.doc.organization_lead == 1) {
			this.frm.set_value("lead_name", this.frm.doc.company_name);
		}
	},

	contact_date: function() {
		if (this.frm.doc.contact_date) {
			let d = moment(this.frm.doc.contact_date);
			d.add(1, "hours");
			this.frm.set_value("ends_on", d.format(frappe.defaultDatetimeFormat));
		}
	}
});

$.extend(cur_frm.cscript, new erpnext.LeadController({frm: cur_frm}));


/* section below contains general functions*/
// =================================================================================================

// global variables

var field_to_hide_unhide = {
	new_connection:["region","zone","landlord_first_name",
		"landlord_middle_name","landlord_surname",
		"plot_no","landlord_phone_number_","type_of_sanitation",
		"gps_location"
	],
	all:["region","zone","landlord_first_name",
		"landlord_middle_name","landlord_surname",
		"plot_no","landlord_phone_number_","type_of_sanitation",
		"gps_location"
	],
}

/*function that hides fields ,called on refresh*/
function hide_unhide_fields(frm, list_of_fields, hide_or_unhide) {
	for (var i = 0; i < list_of_fields.length; i++) {
		frm.toggle_display(list_of_fields[i], hide_or_unhide)
	}
}


// function that hides or unhides certain fields on refresh
function hide_unhide_on_refresh(frm) {
	console.log("On refresh")
	if (frm.doc.new_connection == "Willing to be connected") {
		hide_function(frm, field_to_hide_unhide, "new_connection")
	}
	else if (frm.doc.new_connection == "Not Willing to be connected") {
		hide_function(frm, field_to_hide_unhide, "new_connection")
	}
	else {
		hide_function(frm, field_to_hide_unhide, "none")
	}

	function hide_function(frm, field_to_hide_unhide, selected_option) {
		var hide_fields = field_to_hide_unhide["all"]
		var unhide_fields = field_to_hide_unhide[selected_option]
		if (selected_option == "none") {
			hide_unhide_fields(frm, hide_fields, false)
		}
		else {
			hide_unhide_fields(frm, hide_fields, false)
			hide_unhide_fields(frm, unhide_fields, true)
		}
	}
}



/* end of the general functions section
// =================================================================================================
/* This section  contains functions that are triggered by the form action refresh or
reload to perform various action*/

/* end of the form triggered functions section
// =================================================================================================
/*function that acts when the fields in the sheet are filled*/


frappe.ui.form.on('Lead', {
	refresh: function(frm) {
		hide_unhide_on_refresh(frm)

	}
});


frappe.ui.form.on("Lead", "new_connection", function (frm) {
	console.log("clicked")
	frm.refresh()

})