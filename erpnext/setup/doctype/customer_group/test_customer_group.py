# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: GNU General Public License v3. See license.txt
from __future__ import unicode_literals

# test_ignore = ["Price List"]

import frappe
import frappe.defaults
import unittest

# test_records = frappe.get_test_records('Customer Group')


class TestCustomerGroup(unittest.TestCase):
    '''
    Class that tests the CustomerGroup doctype  
    functionality
    '''
    @classmethod
    def setUpClass(cls):
        '''
        Function that sets up required test data only
        once
        '''
        pass

    def setUp(self):
        '''
        Runs at the beggining of each tests
        '''
        self.test_customer_group = frappe.get_doc({
			"doctype":"Customer Group",
			"parent_customer_group":"All Customer Groups",
            "customer_group_name":"Test Customer Group"
		})
        # self.test_customer_group.insert()

    
    def tearDown(self):
        # self.test_customer_group = frappe.get_doc({
        #     "doctype":"Customer Group",
        #     "name":"Test Customer Group"
		# })
        # self.test_customer_group.delete()
        pass


    def test_cus(self): 
        pass
