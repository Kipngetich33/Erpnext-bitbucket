from __future__ import unicode_literals

import requests
import frappe
import frappe.defaults


# Adding tasks to run periodically
def pull_from_ona():
    '''
    Function that pulls data from the ona form and 
    returns result in json format
    '''
    print "*"*80
    print "Pulling data from ona"
    # determine next starting point
    current_start = get_last_system_values()
    if(len(current_start)>0):
        current_start_value = current_start[0]["int_value"]
    else: 
        current_start_value = 0

    url = "https://api.ona.io/api/v1/data/374744?start={}".format(current_start_value)
    response = requests.get(url,auth=("upande", "upandegani"))
    retrived_form_data = response.json()
    return retrived_form_data

def process_pulled_data(data):
    '''
    Function that process the data pulled from ona form
    add functionality to ensure that get rid of duplicates -
    this functionality should be added to controllers 
    '''
    print data
    if(len(data)>0):
        for record in data:
            current_record_details = {}
            current_record_details["customer_name"] = parse_names(record["customer_name"])
            current_record_details["customer_group"] = parse_names(record["customer_group"])
            current_record_details["territory"] = parse_names(record["territory"])
            current_record_details["area"] = parse_names(record["area"])
            current_record_details["zone"] = parse_names(record["zone"])
            current_record_details["route"] = parse_names(record["route"])

            # save each customer_details
            save_new_customer_details(current_record_details)

        return data
    else:
        print "No new data from ona form"

def parse_names(given_name):
    '''
    Function that parses the name to give the 
    format by getting rid of underscores
    eg.
        input:
            "area_a"
        output:
            Area A
    '''

    split_name = given_name.split("_")
    full_word = ''
    for part in split_name:
        if split_name.index(part) == 0:
            full_word += part.capitalize()
        else:
            full_word +=" "
            full_word += part.capitalize()

    return full_word

def save_new_customer_details(data):
    '''
    Function that saves the customer details
    '''
    print "saving customer details"
    current_customer= frappe.get_doc({
        "doctype":"Customer",
        "customer_name":data["customer_name"],
        "customer_group":data["customer_group"],
        "territory":data["territory"],
        "area":data["area"],
        "zone":data["zone"],
        "route":data["route"]
	})
    current_customer.insert()

def get_last_system_values():
    '''
    Function that gets the last system values for
    pull_from_ona
    output:
        a list of system values objects i.e [<system values obj..>,..]
    '''
    last_system_values = frappe.get_list("System Values",
        fields=["*"],
        filters = {
            "target_document":"pull_from_ona"
        }
    )
    return last_system_values



def update_system_values(data):
    '''
    Function that update the system values 
    to determine the next start of the 
    pull_from_ona function
    '''
    number_of_new_items = len(data)
    #the the last system value for pulled data
    last_system_values = get_last_system_values()

    if(len(last_system_values)==0):
        #create a new system values
        new_system_value = frappe.get_doc({
			"doctype":"System Values",
            "target_document":"pull_from_ona",
			"int_value":number_of_new_items
		})
        new_system_value.insert()

    else:
        #update the integer value
        existing_system_values = frappe.get_doc("System Values",last_system_values[0].name)
        existing_system_values.int_value = int(last_system_values[0]["int_value"])+number_of_new_items
        existing_system_values.save()

def main_function():
    '''
    This is the main function that calls all the 
    other task functions
    '''
    '''
    #pull data from ona Test form
    recieved_data = pull_from_ona()
    #process the data
    processed_data = process_pulled_data(recieved_data)
    #update system values
    update_system_values(recieved_data)

    # pull from ona Rujuwasco form
    '''
    # form_id = 374744
    form_id = 290920
    current_start = get_last_system_values1(form_id)
    pulled_data = pull_from_ona1(current_start,form_id)
    process_pulled_data1(pulled_data)


# functions for Rujuwasco Data

def get_last_system_values1(form_id):
    '''
    Function that gets the last system values for
    pull_from_ona
    output:
        a list of system values objects i.e [<system values obj..>,..]
    '''
    last_system_values = frappe.get_list("System Values",
        fields=["*"],
        filters = {
            "target_document":"pull_from_ona",
            "target_record":form_id
        }
    )
    if(len(last_system_values)==0):
        return 0
    else:
        return last_system_values[0]["int_value"]

def pull_from_ona1(current_start,form_id):
    '''
    Function that pulls data from the ona form and 
    returns result in json format
    '''
    print "*"*80
    print "Pulling data from ona"
    url = "https://api.ona.io/api/v1/data/{}?start={}".format(form_id,current_start)
    response = requests.get(url,auth=("upande", "upandegani"))
    retrived_form_data = response.json()
    return retrived_form_data


def process_pulled_data1(pulled_data):
    '''
    Function that process the data pulled from ona form
    add functionality to ensure that get rid of duplicates -
    this functionality should be added to controllers 
    '''
    # print data
    # if(len(data)>0):
    #     for record in data:
    #         current_record_details = {}
    #         current_record_details["customer_name"] = parse_names(record["customer_name"])
    #         current_record_details["customer_group"] = parse_names(record["customer_group"])
    #         current_record_details["territory"] = parse_names(record["territory"])
    #         current_record_details["area"] = parse_names(record["area"])
    #         current_record_details["zone"] = parse_names(record["zone"])
    #         current_record_details["route"] = parse_names(record["route"])

    #         # save each customer_details
    #         save_new_customer_details(current_record_details)

    #     return data
    # else:
    #     print "No new data from ona form"
    if(len(pulled_data)>0):
        for record in pulled_data:
            #call functionality to check data
            check_pulled_data(record)

def check_pulled_data(record):
    '''
    check Territory, Account else create them
    '''
    print "*"*100
    region = record["service_area_details/region_name"]
    print region
    zone_name = "service_area_details/"+region
    zone = record[zone_name]
    print zone

    # for i in record.keys():
    #     print i 
    #     print record[i]
    #     print ""

