/*
 * Copyright (C) 2013 salesforce.com, inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* 
 * These tests are different from those in js_provider.newComponent$...
 * In this test file provider:clientProvider is included as the facet of the stub.
 * provider:newComponent create the provider:clientProvider component using newComponentAsync() API  
 */

({
    /**
     * Verify that a client side provider can replace itself with a simple component.
     */
    testSimpleComponentProvided: {
        //attributes: {config: "{componentDef:'markup://aura:text',attributes:{value:'resolver'}}"},
        test: function (cmp) {
            var providedCmp = cmp.find("simpleComponentProvided").get("v.body")[0];
            $A.test.assertNotNull(providedCmp);

            $A.test.assertEquals("markup://aura:text", providedCmp.getDef().getDescriptor().getQualifiedName(),
                "Found unexpected component by client side provider");
            $A.test.assertEquals("resolver", providedCmp.get("v.value"),
                "Attribute values were not set on provided component");
            $A.test.assertEquals("resolver", $A.test.getTextByComponent(providedCmp));

            //Verify that find using aura:id of provider component will return the expected provided component
            $A.test.assertEquals(providedCmp, cmp.find("provider1"), "Provided component no accessible using aura:id of provider");
        }
    },
    /**
     * Verify that a client side provider can replace itself with a component which also has serverside dependencies.

     * TODO: W-1961207 &  W-1787477 server dependent client provided will need completion of component creation context
     * */
    _testComponentWithModelProvided: {
        attributes: {config: "{componentDef:'markup://provider:cmpWithModel',attributes:{value:'secondThing'}}"},
        test: function (cmp) {
            var providedCmp = cmp.find("cmpWSrvrDpndncyProvided").get("v.body")[0];
            $A.test.assertNotNull(providedCmp);

            $A.test.assertEquals("markup://provider:cmpWithModel", providedCmp.getDef().getDescriptor().getQualifiedName(),
                "Found unexpected component by client side provider");
            $A.test.assertEquals("secondThing", providedCmp.get("v.value"),
                "Attribute values were not set on provided component");
            $A.test.assertEquals("firstThingDefault", providedCmp.get("m.firstThing"),
                "Model values were not available on provided component");
            $A.test.assertEquals("firstThingDefaultsecondThing", $A.test.getTextByComponent(providedCmp));

            //Verify that find using aura:id of provider component will return the expected provided component
            $A.test.assertEquals(providedCmp, cmp.find("provider2"), "Provided component no accessible using aura:id of provider");
        }
    },

    testExtendedComponentHasItsOwnAttributes: {
        test: function(cmp) {
            var providerA = cmp.find("provider3"),
                attrsA = providerA.getAttributes(),
                providerB = cmp.find("provider4"),
                attrsB = providerB.getAttributes(),
                defs = providerB.getDef().getAttributeDefs();

            $A.test.assertEquals("A", attrsA.getRawValue("type"), "providerA should have value set by itself");
            $A.test.assertFalse(attrsA.getRawValue("attA"), "providerA should have own attribute and value");
            $A.test.assertEquals("b", attrsB.getRawValue("type"), "providerB should have value set by parent");
            $A.test.assertTrue(attrsB.getRawValue("attB"), "providerB should have own attribute and value");
            $A.test.assertNotUndefinedOrNull(defs.getDef("new1"), "new1 attribute should exist");
            $A.test.assertNotUndefinedOrNull(defs.getDef("new2"), "new2 attribute should exist");
            $A.test.assertNotUndefinedOrNull(defs.getDef("new3"), "new3 attribute should exist");
        }
    }
})