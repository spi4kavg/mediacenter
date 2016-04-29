# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import json
from django.test import TestCase
from django.test import Client


class LoginTestCase(TestCase):

    def setUp(self):
        self.url = "/api/v1/auth/login/"
        self.client = Client()

    def test_empty(self):
        data = {
            "login": "",
            "password": "",
        }

        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 200)
        content = json.loads(response.content)

        self.assertIn("errors", content.keys())

        self.assertIn("login", content['errors'].keys())
        self.assertIn("password", content['errors'])
        
        error_msg = "This field may not be blank."
        self.assertEqual([error_msg], content["errors"]["login"])
        error_msg = "This field may not be blank."
        self.assertEqual([error_msg], content["errors"]["password"])

    def test_incorrect_login(self):
        data = {
            "login": "qwe",
            "password": "qwe",
        }

        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 200)
        content = json.loads(response.content)

        self.assertIn("errors", content.keys())
        self.assertTrue("login", content["errors"])

        error_msg = "Incorrect login"

        self.assertTrue([error_msg], content["errors"]["login"])

    def test_incorrect_password(self):
        data = {
            "login": "admin",
            "password": "qwe",
        }

        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 200)
        content = json.loads(response.content)

        self.assertIn("errors", content.keys())
        self.assertIn("password", content["errors"])

        error_msg = "Incorrect password"
        self.assertTrue([error_msg], content["errors"]["password"])

    def test_success(self):
        data = {
            "login": "admin",
            "password": "admin",
        }

        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 200)
        content = json.loads(response.content)

        self.assertFalse(hasattr(content.keys(), "errors"))


class ApartmentComplexList(TestCase):

    def setUp(self):
        self.url = "/api/v1/apartment-complex/"
        self.client = Client()

    def test_methods(self):
        s = self.client.session
        s['logged_in'] = True
        s.save()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, 200)

        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, 405)

    def test_permissions(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 403)
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, 403)

    def test_get_list(self):
        pass

    def test_empty_data(self):
        s = self.client.session
        s['logged_in'] = True
        s.save()
        data = {
            "name": "",
            "city": "",
            "street": "",
            "house": "",
            "structure": "",
            "site": "",
            "email": "",
            "phone": "",
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 200)
        content = json.loads(response.content)

        self.assertIn("errors", content)
        self.assertIn("name", content["errors"])
        self.assertIn("city", content["errors"])
        self.assertIn("street", content["errors"])
        self.assertIn("house", content["errors"])
        self.assertNotIn("structure", content["errors"])
        self.assertNotIn("site", content["errors"])
        self.assertNotIn("email", content["errors"])
        self.assertNotIn("phone", content["errors"])

        error_msg = "This field may not be blank."
        self.assertEqual([error_msg], content["errors"]["name"])
        self.assertEqual([error_msg], content["errors"]["city"])
        self.assertEqual([error_msg], content["errors"]["street"])
        self.assertEqual([error_msg], content["errors"]["house"])

    def test_success_create(self):
        s = self.client.session
        s['logged_in'] = True
        s.save()
        data = {
            "name": "test-name",
            "city": "testcity",
            "street": "test-street",
            "house": "house/9",
            "structure": "struct/10",
            "site": "http://test.com",
            "email": "email@mail.ru",
            "phone": "8 (911) 911 12 34",
        }

        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 201)