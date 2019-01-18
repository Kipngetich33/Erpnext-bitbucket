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
        pass

    def test_cus(self): 
        pass


# test customer
# self.test_customer_1 = frappe.get_doc({
# 	"doctype":"Customer Group",
# 	"customer_name":"Test Customer",
# 	"customer_group":"Domestic",
# 	"territory":"Kenya",
# 	"area":"Area A",
# 	"zone":"Zone 1.0",
# 	"route":"Route 1.1"
# })