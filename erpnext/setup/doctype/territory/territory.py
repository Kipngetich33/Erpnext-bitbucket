# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: GNU General Public License v3. See license.txt

from __future__ import unicode_literals
import frappe


from frappe.utils import flt
from frappe import _

from frappe.utils.nestedset import NestedSet

class Territory(NestedSet):
   
    print "*"*80
    print "this prints first"
    nsm_parent_field = 'parent_territory'
    def validate(self):
        print "*"*100
        print "validating doctype"
        for d in self.get('targets') or []:
            if not flt(d.target_qty) and not flt(d.target_amount):
                frappe.throw(_("Either target qty or target amount is mandatory"))
        
        # capitalize the name
        capitalized_name = parse_names(self.name)
        self.actual_territory_name = capitalized_name
        # check if Territory is already saved
        if(self.saved == "yes"):
            # do nothing 
            pass
        else:
            self.saved = "yes"
            self.name = capitalized_name + "-("+self.parent_territory+")"

    def on_update(self):
        super(Territory, self).on_update()
        self.validate_one_root()

def on_doctype_update():
	frappe.db.add_index("Territory", ["lft", "rgt"])

def parse_names(given_name):
    '''
    Function that parses the name to give the 
    format by getting rid of underscores
    eg.
        input:
            "area a"
        output:
            Area A
    '''
    split_name = given_name.split(" ")
    full_word = ''
    for part in split_name:
        if split_name.index(part) == 0:
            full_word += part.capitalize()
        else:
            full_word +=" "
            full_word += part.capitalize()
    return full_word

