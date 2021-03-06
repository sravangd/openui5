/*!
 * ${copyright}
 */
sap.ui.require([
	"sap/ui/base/BindingParser", "sap/ui/model/odata/AnnotationHelper",
	"sap/ui/model/odata/_AnnotationHelperBasics", "sap/ui/model/odata/_AnnotationHelperExpression"
], function(BindingParser, AnnotationHelper, Basics, Expression) {
	/*global deepEqual, equal, expect, module, notDeepEqual, notEqual, notPropEqual,
	notStrictEqual, ok, propEqual, sinon, strictEqual, test, throws,
	*/
	"use strict";

	var oCIRCULAR = {},
		oBoolean = {
			name : "sap.ui.model.odata.type.Boolean",
			constraints : {"nullable" : false}
		},
		oByte = {
			name : "sap.ui.model.odata.type.Byte",
			constraints : {"nullable" : false}
		},
		oDateTime = {
			name : "sap.ui.model.odata.type.DateTime",
			constraints : {"nullable": false, "isDateOnly": true}
		},
		oDateTimeOffset = {
			name : "sap.ui.model.odata.type.DateTimeOffset",
			constraints : {"nullable": false}
		},
		oDecimal = {
			name : "sap.ui.model.odata.type.Decimal",
			constraints : {"nullable": false, "precision" : 13, "scale" : 3}
		},
		oDouble = {
			name : "sap.ui.model.odata.type.Double",
			constraints : {"nullable": false}
		},
		oFloat = {
			name : "sap.ui.model.odata.type.Single"
		},
		oGuid = {
			name : "sap.ui.model.odata.type.Guid",
			constraints : {"nullable": false}
		},
		oInt16 = {
			name : "sap.ui.model.odata.type.Int16",
			constraints : {"nullable" : false}
		},
		oInt32 = {
			name : "sap.ui.model.odata.type.Int32",
			constraints : {"nullable" : false}
		},
		oInt64 = {
			name : "sap.ui.model.odata.type.Int64",
			constraints : {"nullable" : false}
		},
		oSByte = {
			name : "sap.ui.model.odata.type.SByte",
			constraints : {"nullable" : false}
		},
		oSingle = {
			name : "sap.ui.model.odata.type.Single",
			constraints : {"nullable" : false}
		},
		oString10 = {
			name : "sap.ui.model.odata.type.String",
			constraints : {"nullable" : false, "maxLength" : 10}
		},
		oString80 = {
			name : "sap.ui.model.odata.type.String",
			constraints : {"maxLength" : 80}
		},
		oTime = {
			name : "sap.ui.model.odata.type.Time",
			constraints : {"nullable" : false}
		},
		sFakeAnnotations = '\
<?xml version="1.0" encoding="utf-8"?>\
<edmx:Edmx Version="4.0"\
	xmlns="http://docs.oasis-open.org/odata/ns/edm"\
	xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx">\
<edmx:DataServices>\
<Schema Namespace="zanno4sample_anno_mdl.v1">\
	<Annotations Target="GWSAMPLE_BASIC.BusinessPartner">\
		<Annotation Term="com.sap.vocabularies.UI.v1.Identification">\
			<Collection>\
				<!-- standalone fillUriTemplate -->\
				<Record Type="com.sap.vocabularies.UI.v1.DataFieldWithUrl">\
					<PropertyValue Property="Url">\
						<UrlRef>\
							<Apply Function="odata.fillUriTemplate">\
								<String><![CDATA[#BusinessPartner-displayFactSheet?BusinessPartnerID={ID1}]]></String>\
								<LabeledElement Name="ID1">\
									<Path>BusinessPartnerID</Path>\
								</LabeledElement>\
							</Apply>\
						</UrlRef>\
					</PropertyValue>\
				</Record>\
				<!-- concat embeds concat & uriEncode -->\
				<Record Type="com.sap.vocabularies.UI.v1.DataField">\
					<PropertyValue Property="Value">\
						<Apply Function="odata.concat">\
							<Path>CompanyName</Path>\
							<Apply Function="odata.concat">\
								<String> </String>\
							</Apply>\
							<Apply Function="odata.uriEncode">\
								<Path>LegalForm</Path>\
							</Apply>\
						</Apply>\
					</PropertyValue>\
				</Record>\
				<!-- uriEncode embeds concat -->\
				<Record Type="com.sap.vocabularies.UI.v1.DataField">\
					<PropertyValue Property="Value">\
						<Apply Function="odata.uriEncode">\
							<Apply Function="odata.concat">\
								<Path>CompanyName</Path>\
								<String> </String>\
								<Path>LegalForm</Path>\
							</Apply>\
						</Apply>\
					</PropertyValue>\
				</Record>\
				<!-- concat w/ constants -->\
				<Record Type="com.sap.vocabularies.UI.v1.DataField">\
					<PropertyValue Property="Value">\
						<Apply Function="odata.concat">\
							<Bool>true</Bool>\
							<String>|</String>\
							<Date>2015-03-24</Date>\
							<String>|</String>\
							<DateTimeOffset>2015-03-24T14:03:27Z</DateTimeOffset>\
							<String>|</String>\
							<Decimal>-123456789012345678901234567890.1234567890</Decimal>\
							<String>|</String>\
							<Float>-7.4503e-36</Float>\
							<String>|</String>\
							<Guid>0050568D-393C-1ED4-9D97-E65F0F3FCC23</Guid>\
							<String>|</String>\
							<!-- Number.MAX_SAFE_INTEGER + 1 -->\
							<Int>9007199254740992</Int>\
							<String>|</String>\
							<TimeOfDay>13:57:06</TimeOfDay>\
						</Apply>\
					</PropertyValue>\
				</Record>\
				<!-- fillUriTemplate w/ constants -->\
				<Record Type="com.sap.vocabularies.UI.v1.DataFieldWithUrl">\
					<PropertyValue Property="Url">\
						<UrlRef>\
							<Apply Function="odata.fillUriTemplate">\
								<String><![CDATA[#{Bool}/{Date}/{DateTimeOffset}/{Decimal}/{Float}/{Guid}/{Int}/{String}/{TimeOfDay}]]></String>\
								<LabeledElement Name="Bool">\
									<Bool>true</Bool>\
								</LabeledElement>\
								<LabeledElement Name="Date">\
									<Date>2015-03-24</Date>\
								</LabeledElement>\
								<LabeledElement Name="DateTimeOffset">\
									<DateTimeOffset>2015-03-24T14:03:27Z</DateTimeOffset>\
								</LabeledElement>\
								<LabeledElement Name="Decimal">\
									<Decimal>-123456789012345678901234567890.1234567890</Decimal>\
								</LabeledElement>\
								<LabeledElement Name="Float">\
									<Float>-7.4503e-36</Float>\
								</LabeledElement>\
								<LabeledElement Name="Guid">\
									<Guid>0050568D-393C-1ED4-9D97-E65F0F3FCC23</Guid>\
								</LabeledElement>\
								<LabeledElement Name="Int">\
									<Int>9007199254740992</Int>\
								</LabeledElement>\
								<LabeledElement Name="String">\
									<String>hello, world</String>\
								</LabeledElement>\
								<LabeledElement Name="TimeOfDay">\
									<TimeOfDay>13:57:06</TimeOfDay>\
								</LabeledElement>\
							</Apply>\
						</UrlRef>\
					</PropertyValue>\
				</Record>\
				<!-- uriEncode w/ constants -->\
				<Record Type="com.sap.vocabularies.UI.v1.DataFieldWithUrl">\
					<PropertyValue Property="Url">\
						<UrlRef>\
							<Apply Function="odata.fillUriTemplate">\
								<String><![CDATA[{Bool}_{DateTimeOffset}_{Decimal}_{Float}_{Guid}_{Int}_{String}_{TimeOfDay}]]></String>\
								<LabeledElement Name="Bool">\
									<Apply Function="odata.uriEncode">\
										<Bool>true</Bool>\
									</Apply>\
								</LabeledElement>\
								<LabeledElement Name="DateTimeOffset">\
									<Apply Function="odata.uriEncode">\
										<!-- TODO split seconds, e.g. ".123456789012" -->\
										<DateTimeOffset>2015-03-24T14:03:27Z</DateTimeOffset>\
									</Apply>\
								</LabeledElement>\
								<LabeledElement Name="Decimal">\
									<Apply Function="odata.uriEncode">\
										<Decimal>-123456789012345678901234567890.1234567890</Decimal>\
									</Apply>\
								</LabeledElement>\
								<LabeledElement Name="Float">\
									<Apply Function="odata.uriEncode">\
										<Float>-7.4503e-36</Float>\
									</Apply>\
								</LabeledElement>\
								<LabeledElement Name="Guid">\
									<Apply Function="odata.uriEncode">\
										<Guid>0050568D-393C-1ED4-9D97-E65F0F3FCC23</Guid>\
									</Apply>\
								</LabeledElement>\
								<LabeledElement Name="Int">\
									<Apply Function="odata.uriEncode">\
										<Int>9007199254740992</Int>\
									</Apply>\
								</LabeledElement>\
								<LabeledElement Name="String">\
									<Apply Function="odata.uriEncode">\
										<String>hello, world</String>\
									</Apply>\
								</LabeledElement>\
								<LabeledElement Name="TimeOfDay">\
									<Apply Function="odata.uriEncode">\
										<TimeOfDay>13:57:06.123456789012</TimeOfDay>\
									</Apply>\
								</LabeledElement>\
							</Apply>\
						</UrlRef>\
					</PropertyValue>\
				</Record>\
				<!-- Comparison Operators -->\
				<Record Type="com.sap.vocabularies.UI.v1.DataField">\
					<PropertyValue Property="Value">\
						<And>\
							<Eq>\
								<Lt>\
									<Path>p1</Path>\
									<Path>p2</Path>\
								</Lt>\
								<Gt>\
									<Path>p4</Path>\
									<Path>p5</Path>\
								</Gt>\
							</Eq>\
							<Ne>\
								<Ge>\
									<Path>p6</Path>\
									<Path>p7</Path>\
								</Ge>\
								<Le>\
									<Path>p8</Path>\
									<Path>p9</Path>\
								</Le>\
							</Ne>\
						</And>\
					</PropertyValue>\
				</Record>\
				<!-- Logical Operators -->\
				<Record Type="com.sap.vocabularies.UI.v1.DataField">\
					<PropertyValue Property="Value">\
						<Or>\
							<Not>\
								<Eq>\
									<Path>p1</Path>\
									<Path>p2</Path>\
								</Eq>\
							</Not>\
							<And>\
								<Eq>\
									<Path>p3</Path>\
									<Path>p4</Path>\
								</Eq>\
								<Eq>\
									<Path>p5</Path>\
									<Path>p6</Path>\
								</Eq>\
							</And>\
						</Or>\
					</PropertyValue>\
				</Record>\
			</Collection>\
		</Annotation>\
	</Annotations>\
</Schema>\
</edmx:DataServices>\
</edmx:Edmx>\
		',
		oTestData = {
			"dataServices" : {
				"schema" : [{
					"entityType" : [{
						// skip BusinessPartner
					}, {
						"property" : [{
							"name" : "_Boolean",
							"type" : "Edm.Boolean",
							"nullable" : "false"
						}, {
							"name" : "_Byte",
							"type" : "Edm.Byte",
							"nullable" : "false"
						}, {
							"name" : "_DateTime",
							"type" : "Edm.DateTime",
							"nullable" : "false",
							"sap:display-format" : "Date"
						}, {
							"name" : "_DateTimeOffset",
							"type" : "Edm.DateTimeOffset",
							"nullable" : "false"
						}, {
							"name" : "_Decimal",
							"type" : "Edm.Decimal",
							"nullable" : "false",
							"precision" : "13",
							"scale" : "3"
						}, {
							"name" : "_Double",
							"type" : "Edm.Double",
							"nullable" : "false"
						}, {
							"name" : "_Float",
							"type" : "Edm.Float"
						}, {
							"name" : "_Guid",
							"type" : "Edm.Guid",
							"nullable" : "false"
						}, {
							"name" : "_Int16",
							"type" : "Edm.Int16",
							"nullable" : "false"
						}, {
							"name" : "_Int32",
							"type" : "Edm.Int32",
							"nullable" : "false"
						}, {
							"name" : "_Int64",
							"type" : "Edm.Int64",
							"nullable" : "false"
						}, {
							"name" : "_SByte",
							"type" : "Edm.SByte",
							"nullable" : "false"
						}, {
							"name" : "_Single",
							"type" : "Edm.Single",
							"nullable" : "false"
						}, {
							"name" : "_String10",
							"type" : "Edm.String",
							"maxLength" : "10",
							"nullable" : "false"
						}, {
							"name" : "_String80",
							"type" : "Edm.String",
							"maxLength" : "80"
						}, {
							"name" : "_Time",
							"type" : "Edm.Time",
							"nullable" : "false"
						}],
						"com.sap.vocabularies.UI.v1.Identification" : [{
							"Value" : {"Path" : "_Boolean"}
						}, {
							"Value" : {"Path" : "_Byte"}
						}, {
							"Value" : {"Path" : "_DateTime"}
						}, {
							"Value" : {"Path" : "_DateTimeOffset"}
						}, {
							"Value" : {"Path" : "_Decimal"}
						}, {
							"Value" : {"Path" : "_Double"}
						}, {
							"Value" : {"Path" : "_Float"}
						}, {
							"Value" : {"Path" : "_Guid"}
						}, {
							"Value" : {"Path" : "_Int16"}
						}, {
							"Value" : {"Path" : "_Int32"}
						}, {
							"Value" : {"Path" : "_Int64"}
						}, {
							"Value" : {"Path" : "_SByte"}
						}, {
							"Value" : {"Path" : "_Single"}
						}, {
							"Value" : {"Path" : "_String10"}
						}, {
							"Value" : {"Path" : "_String80"}
						}, {
							"Value" : {"Path" : "_Time"}
						}]
					}]
				}]
			}
		},
		mDataMetaModel = {}, // cached instances, see withMetaModel()
		oTestModel = new sap.ui.model.json.JSONModel(oTestData),
		aNonStrings = [undefined, null, {}, false, true, 0, 1, NaN],
		sPath2BusinessPartner = "/dataServices/schema/0/entityType/0",
		sPath2Product = "/dataServices/schema/0/entityType/1",
		sPath2SalesOrder = "/dataServices/schema/0/entityType/2",
		sPath2SalesOrderLineItem = "/dataServices/schema/0/entityType/3",
		sPath2Contact = "/dataServices/schema/0/entityType/4",
		fnEscape = BindingParser.complexParser.escape,
		fnGetNavigationPath = AnnotationHelper.getNavigationPath,
		fnIsMultiple = AnnotationHelper.isMultiple,
		fnSimplePath = AnnotationHelper.simplePath,
		fnText = AnnotationHelper.text,
		TestControl = sap.ui.base.ManagedObject.extend("TestControl", {
			metadata: {
				properties: {
					text: "string"
				}
			}
		}),
		sAnnotations = jQuery.sap.syncGetText("model/GWSAMPLE_BASIC.annotations.xml", "", null),
		sMetadata = jQuery.sap.syncGetText("model/GWSAMPLE_BASIC.metadata.xml", "", null),
		mHeaders = {"Content-Type" : "application/xml"},
		mFixture = {
			"/GWSAMPLE_BASIC/$metadata" : [200, mHeaders, sMetadata],
			"/GWSAMPLE_BASIC/annotations" : [200, mHeaders, sAnnotations],
			"/fake/annotations" : [200, mHeaders, sFakeAnnotations]
		};

	oCIRCULAR.circle = oCIRCULAR; // some circular structure

	/**
	 * Formats the value using the AnnotationHelper. Provides access to the given current context.
	 *
	 * @param {any} vValue
	 * @param {sap.ui.model.Context} [oCurrentContext]
	 * @param {function] [fnMethod=sap.ui.model.odata.AnnotationHelper.format]
	 *   the custom formatter function to call
	 * @returns {string}
	 *   a binding string
	 */
	function format(vValue, oCurrentContext, fnMethod) {
		var sResult;

		if (typeof oCurrentContext === "function") { // allow oCurrentContext to be omitted
			fnMethod = oCurrentContext;
			oCurrentContext = null;
		}
		fnMethod = fnMethod || AnnotationHelper.format;
		return fnMethod.requiresIContext === true
			? fnMethod(oCurrentContext, vValue)
			: fnMethod(vValue);
	}

	/**
	 * Parses the value via the complex parser.
	 *
	 * @param {string} sBinding
	 *   a binding string
	 * @returns {object|string}
	 *   a binding info or the formatted, unescaped value
	 */
	function parse(sBinding) {
		// @see applySettings: complex parser returns undefined if there is nothing to unescape
		return BindingParser.complexParser(sBinding, undefined, true) || sBinding;
	}

	/**
	 * Formats the value using the AnnotationHelper and then parses the result via the complex
	 * parser. Provides access to the given current context.
	 *
	 * @param {any} vValue
	 * @param {sap.ui.model.Context} [oCurrentContext]
	 * @param {function] [fnMethod=sap.ui.model.odata.AnnotationHelper.format]
	 *   the custom formatter function to call
	 * @returns {object|string}
	 *   a binding info or the formatted, unescaped value
	 */
	function formatAndParse(vValue, oCurrentContext, fnMethod) {
		return parse(format(vValue, oCurrentContext, fnMethod));
	}

	/**
	 * Tests that the raw value for the given context actually leads to the expected binding.
	 *
	 * @param {sap.ui.model.Context} oCurrentContext
	 *   the context pointing to the raw value
	 * @param {any} vExpected
	 *   the expected result from binding the <code>format</code> result against the model
	 * @param {object} oModelData
	 *   the data for the JSONModel to bind to
	 */
	function testBinding(oCurrentContext, vExpected, oModelData) {
		var oModel = new sap.ui.model.json.JSONModel(oModelData),
			oControl = new TestControl({
				models: oModel,
				bindingContexts: oModel.createBindingContext("/")
			}),
			oRawValue = oCurrentContext.getObject(),
			sBinding = format(oRawValue, oCurrentContext),
			oSingleBindingInfo = parse(sBinding);

		oControl.bindProperty("text", oSingleBindingInfo);
		strictEqual(oControl.getText(), vExpected, sBinding);
	}

	/**
	 * Runs the given code under test with an <code>ODataMetaModel</code>.
	 *
	 * @param {string} [sAnnotationUrl="/GWSAMPLE_BASIC/annotations"]
	 * @param {function} fnCodeUnderTest
	 * @returns {any|Promise}
	 *   (a promise to) whatever <code>fnCodeUnderTest</code> returns
	 */
	function withMetaModel(sAnnotationUrl, fnCodeUnderTest) {
		var oMetaModel,
			oModel,
			oSandbox, // <a href ="http://sinonjs.org/docs/#sandbox">a Sinon.JS sandbox</a>
			oServer,
			sUrl;

		function onFailed(oEvent) {
			var oParameters = oEvent.getParameters();
			while (oParameters.getParameters) { // drill down to avoid circular structure
				oParameters = oParameters.getParameters();
			}
			ok(false, "Failed to load: " + JSON.stringify(oParameters));
		}

		/*
		 * Call the given "code under test" with the given OData meta model, making sure that
		 * no changes to the model are kept in the cached singleton.
		 */
		function call(fnCodeUnderTest, oDataMetaModel) {
			var sCopy = JSON.stringify(oDataMetaModel.getObject("/"));

			try {
				return fnCodeUnderTest(oDataMetaModel);
			} finally {
				oDataMetaModel.getObject("/").dataServices = JSON.parse(sCopy).dataServices;
			}
		}

		if (typeof sAnnotationUrl === "function") {
			fnCodeUnderTest = sAnnotationUrl;
			sAnnotationUrl = "/GWSAMPLE_BASIC/annotations";
		}

		if (mDataMetaModel[sAnnotationUrl]) {
			return call(fnCodeUnderTest, mDataMetaModel[sAnnotationUrl]);
		}

		try {
			// sets up a sandbox in order to use the URLs and responses defined in mFixture;
			// leaves unknown URLs alone
			sinon.config.useFakeServer = true;
			//TODO remove this workaround in IE9 for
			// https://github.com/cjohansen/Sinon.JS/commit/e8de34b5ec92b622ef76267a6dce12674fee6a73
			sinon.xhr.supportsCORS = true;
			oSandbox = sinon.sandbox.create();
			oServer = oSandbox.useFakeServer();

			//TODO how to properly tear down this stuff?
			sinon.FakeXMLHttpRequest.useFilters = true;
			sinon.FakeXMLHttpRequest.addFilter(function(sMethod, sUrl, bAsync) {
				return mFixture[sUrl] === undefined; // do not fake if URL is unknown
			});

			for (sUrl in mFixture) {
				oServer.respondWith(sUrl, mFixture[sUrl]);
			}
			oServer.autoRespond = true;

			// sets up a v2 ODataModel and retrieves an ODataMetaModel from there
			oModel = new sap.ui.model.odata.v2.ODataModel("/GWSAMPLE_BASIC", {
				annotationURI : sAnnotationUrl,
				json : true,
				loadMetadataAsync : true
			});
			oModel.attachMetadataFailed(onFailed);
			oModel.attachAnnotationsFailed(onFailed);
			mDataMetaModel[sAnnotationUrl] = oModel.getMetaModel();

			// calls the code under test once the meta model has loaded
			return mDataMetaModel[sAnnotationUrl].loaded().then(function() {
				return call(fnCodeUnderTest, mDataMetaModel[sAnnotationUrl]);
			});
		} finally {
			oSandbox.restore();
			sap.ui.model.odata.v2.ODataModel.mServiceData = {}; // clear cache
		}
	}

	/**
	 * Runs the given code under test with an <code>ODataMetaModel</code> containing
	 * <code>oTestData</code>.
	 *
	 * @param {function} fnCodeUnderTest
	 */
	function withTestModel(fnCodeUnderTest) {
		return withMetaModel(function (oMetaModel) {
			// evil, test code only: write into ODataMetaModel
			oMetaModel.getObject("/").dataServices = oTestData.dataServices;

			fnCodeUnderTest(oMetaModel);
		});
	}

	//*********************************************************************************************
	module("sap.ui.model.odata.AnnotationHelper.format");

	//*********************************************************************************************
	test("forward to getExpression", function () {
		var oInterface = {},
			oRawValue = {},
			sResult = {};

		this.mock(Expression).expects("getExpression")
			.withExactArgs(oInterface, oRawValue, true).returns(sResult);

		strictEqual(AnnotationHelper.format(oInterface, oRawValue), sResult, "result");
	});

	//*********************************************************************************************
	["", "foo", "{path : 'foo'}", 'path : "{\\f,o,o}"'].forEach(function (sString) {
		test("14.4.11 Expression edm:String: " + sString, function () {
			return withMetaModel(function (oMetaModel) {
				var sMetaPath = sPath2Product
						+ "/com.sap.vocabularies.UI.v1.FieldGroup#Dimensions/Data/0/Label",
					oCurrentContext = oMetaModel.getContext(sMetaPath),
					oRawValue = oMetaModel.getProperty(sMetaPath);

				// evil, test code only: write into ODataMetaModel
				oRawValue.String = sString;

				strictEqual(formatAndParse(oRawValue, oCurrentContext), sString);
			});
		});
	});

	//*********************************************************************************************
	test("14.4.11 Expression edm:String: references", function () {
		return withMetaModel(function (oMetaModel) {
			var sMetaPath = sPath2Product
					+ "/com.sap.vocabularies.UI.v1.FieldGroup#Dimensions/Data/0/Label",
				oCurrentContext = oMetaModel.getContext(sMetaPath),
				oEntityTypeBP,
				oRawValue = oMetaModel.getProperty(sMetaPath),
				oSingleBindingInfo;

			function getSetting(sName) {
				strictEqual(sName, "bindTexts");
				return true;
			}

			oCurrentContext.getSetting = getSetting;

			oSingleBindingInfo = formatAndParse(oRawValue, oCurrentContext);

			deepEqual(oSingleBindingInfo, {path : "/##" + sMetaPath + "/String"});

			// ensure that the formatted value does not contain double quotes
			ok(sap.ui.model.odata.AnnotationHelper.format(oCurrentContext, oRawValue)
				.indexOf('"') < 0);


			// check escaping via fake annotation
			oEntityTypeBP = oMetaModel.getObject(sPath2Product);
			oEntityTypeBP["foo{Dimensions}"]
				= oEntityTypeBP["com.sap.vocabularies.UI.v1.FieldGroup#Dimensions"];
			sMetaPath = sPath2Product + "/foo{Dimensions}/Data/0/Label";
			oCurrentContext = oMetaModel.getContext(sMetaPath);
			oRawValue = oMetaModel.getProperty(sMetaPath);
			oCurrentContext.getSetting = getSetting;

			oSingleBindingInfo = formatAndParse(oRawValue, oCurrentContext);

			deepEqual(oSingleBindingInfo, {path : "/##" + sMetaPath + "/String"});
		});
	});

	//*********************************************************************************************
	[
		{typeName: "Bool", result: "true"},
		{typeName: "Date", result: "2015-03-24"},
		{typeName: "DateTimeOffset", result: "2015-03-24T14:03:27Z"},
		{typeName: "Decimal", result: "-123456789012345678901234567890.1234567890"},
		{typeName: "Float", result: "-7.4503e-36"},
		{typeName: "Guid", result: "0050568D-393C-1ED4-9D97-E65F0F3FCC23"},
		{typeName: "Int", result: "9007199254740992"},
		{typeName: "TimeOfDay", result: "13:57:06"}
	].forEach(function (oFixture, index) {
		test("14.4.x Constant Expression edm:" + oFixture.typeName, function () {
			return withMetaModel("/fake/annotations", function (oMetaModel) {
				var sMetaPath = sPath2BusinessPartner
						+ "/com.sap.vocabularies.UI.v1.Identification/3/Value/Apply/Parameters/"
						+ (2 * index),
					oCurrentContext = oMetaModel.getContext(sMetaPath),
					oRawValue = oMetaModel.getObject(sMetaPath);

				strictEqual(formatAndParse(oRawValue, oCurrentContext), oFixture.result);
			});
		});
	});

	//*********************************************************************************************
	["", "/", ".", "foo", "path : 'foo'", 'path : "{\\f,o,o}"'].forEach(function (sPath) {
		test("14.5.12 Expression edm:Path: " + JSON.stringify(sPath), function () {
			var oMetaModel = new sap.ui.model.json.JSONModel({
					"Value" : {
						"Path" : sPath
					}
				}),
				sMetaPath = "/Value",
				oCurrentContext = oMetaModel.getContext(sMetaPath),
				oRawValue = oMetaModel.getProperty(sMetaPath),
				oSingleBindingInfo = formatAndParse(oRawValue, oCurrentContext);

			strictEqual(typeof oSingleBindingInfo, "object", "got a binding info");
			strictEqual(oSingleBindingInfo.path, sPath);
			strictEqual(oSingleBindingInfo.type, undefined);
		});
	});

	//*********************************************************************************************
	[
		oBoolean,
		oByte,
		oDateTime,
		oDateTimeOffset,
		oDecimal,
		oDouble,
		oFloat,
		oGuid,
		oInt16,
		oInt32,
		oInt64,
		oSByte,
		oSingle,
		oString10,
		oString80,
		oTime
	].forEach(function(oType, i) {
		var sPath = sPath2Product + "/com.sap.vocabularies.UI.v1.Identification/" + i + "/Value";

		test("14.5.12 Expression edm:Path w/ type, path = " + sPath + ", type = " + oType.name,
			function () {
				return withTestModel(function (oMetaModel) {
					var oCurrentContext = oMetaModel.getContext(sPath),
						oRawValue = oTestModel.getObject(sPath),
						sBinding,
						oSingleBindingInfo;

					sBinding = format(oRawValue, oCurrentContext);

					ok(!/constraints\s*:\s*{}/.test(sBinding), "No empty constraints in binding");

					oSingleBindingInfo = parse(sBinding);

					strictEqual(oSingleBindingInfo.path, oRawValue.Path);
					ok(oSingleBindingInfo.type instanceof jQuery.sap.getObject(oType.name),
						"type is " + oType.name);
					deepEqual(oSingleBindingInfo.type.oConstraints, oType.constraints);

					// ensure that the formatted value does not contain double quotes
					ok(AnnotationHelper.format(oCurrentContext, oRawValue).indexOf('"') < 0);
				});
			}
		);
	});
	// Q: output simple binding expression in case application has not opted-in to complex ones?
	//    /* if (ManagedObject.bindingParser === sap.ui.base.BindingParser.simpleParser) {} */
	// A: rather not, we probably need complex bindings in many cases (e.g. for types)

	//*********************************************************************************************
	[
		{Apply : null},
		{Apply : "unsupported"},
		{Apply : {Name : "unsupported"}},
		{Apply : {Name : "odata.concat"}},
		{Apply : {Name : "odata.concat", Parameters : {}}},
		{Apply : {Name : "odata.fillUriTemplate"}},
		{Apply : {Name : "odata.fillUriTemplate", Parameters : {}}},
		{Apply : {Name : "odata.fillUriTemplate", Parameters : []}},
		{Apply : {Name : "odata.fillUriTemplate", Parameters : [{}]}},
		{Apply : {Name : "odata.fillUriTemplate", Parameters : [null]}},
		{Apply : {Name : "odata.fillUriTemplate", Parameters : ["no object"]}},
		{Apply : {Name : "odata.fillUriTemplate", Parameters : [{Type: "NoString"}]}},
		{Apply : {Name : "odata.uriEncode"}},
		{Apply : {Name : "odata.uriEncode", Parameters : {}}},
		{Apply : {Name : "odata.uriEncode", Parameters : []}},
		{Apply : {Name : "odata.uriEncode", Parameters : [null]}}
	].forEach(function (oApply) {
		var sError = "Unsupported: " + Basics.toErrorString(oApply);

		test("14.5.3 Expression edm:Apply: " + sError, function () {
			this.mock(Basics).expects("error").once().throws(new SyntaxError());

			return withMetaModel(function (oMetaModel) {
				var sPath = sPath2Contact + "/com.sap.vocabularies.UI.v1.HeaderInfo/Title/Value",
					oCurrentContext = oMetaModel.getContext(sPath);

				strictEqual(formatAndParse(oApply, oCurrentContext), sError);
			});
		});
	});

	//*********************************************************************************************
	test("14.5.3.1.1 Function odata.concat", function () {
		return withMetaModel(function (oMetaModel) {
			var sPath = sPath2Contact + "/com.sap.vocabularies.UI.v1.HeaderInfo/Title/Value",
				oRawValue = oMetaModel.getObject(sPath);

			//TODO remove this workaround to fix whitespace issue
			oRawValue.Apply.Parameters[1].Value = " ";

			testBinding(oMetaModel.getContext(sPath), "John Doe", {
				FirstName: "John",
				LastName: "Doe"
			});
		});
	});

	//*********************************************************************************************
	test("14.5.3.1.1 Function odata.concat: escaping & unsupported type", function () {
		this.mock(Basics).expects("error").once().throws(new SyntaxError());

		return withMetaModel(function (oMetaModel) {
			var sPath = sPath2Contact + "/com.sap.vocabularies.UI.v1.HeaderInfo/Title/Value",
				oCurrentContext = oMetaModel.getContext(sPath),
				oParameter = {Type: "Int16", Value: 42},
				oRawValue = {
					Apply: {
						Name: "odata.concat",
						// Note: 1st value needs proper escaping!
						// Due to changed error handling this is not tested anymore here
						Parameters: [{Type: "String", Value : "{foo}"}, oParameter]
					}
				};

			strictEqual(formatAndParse(oRawValue, oCurrentContext),
				"Unsupported: " + Basics.toErrorString(oRawValue));
		});
	});

	//*********************************************************************************************
	test("14.5.3.1.1 Function odata.concat: null parameter", function () {
		this.mock(Basics).expects("error").once().throws(new SyntaxError());

		return withMetaModel(function (oMetaModel) {
			var sPath = sPath2Contact + "/com.sap.vocabularies.UI.v1.HeaderInfo/Title/Value",
				oCurrentContext = oMetaModel.getContext(sPath),
				oRawValue = {
					Apply: {
						Name: "odata.concat",
						Parameters: [{Type: "String", Value : "*foo*"}, null]
					}
				};

			strictEqual(formatAndParse(oRawValue, oCurrentContext),
				"Unsupported: " + Basics.toErrorString(oRawValue));
		});
	});

	//*********************************************************************************************
	test("14.5.3.1.1 Function odata.concat: various constants", function () {
		return withMetaModel("/fake/annotations", function (oMetaModel) {
			var sMetaPath = sPath2BusinessPartner
					+ "/com.sap.vocabularies.UI.v1.Identification/3/Value",
				oCurrentContext = oMetaModel.getContext(sMetaPath),
				oRawValue = oMetaModel.getObject(sMetaPath);

			strictEqual(formatAndParse(oRawValue, oCurrentContext),
				"true|" +
				"2015-03-24|" +
				"2015-03-24T14:03:27Z|" +
				"-123456789012345678901234567890.1234567890|" +
				"-7.4503e-36|" +
				"0050568D-393C-1ED4-9D97-E65F0F3FCC23|" +
				"9007199254740992|" +
				"13:57:06");
		});
	});

	//*********************************************************************************************
	test("14.5.3.1.2 odata.fillUriTemplate: fake annotations", function () {
		return withMetaModel("/fake/annotations", function (oMetaModel) {
			var sMetaPath = sPath2BusinessPartner
					+ "/com.sap.vocabularies.UI.v1.Identification/0/Url/UrlRef";

			testBinding(oMetaModel.getContext(sMetaPath),
				"#BusinessPartner-displayFactSheet?BusinessPartnerID=0815", {
				BusinessPartnerID: "0815"
			});
		});
	});

	//*********************************************************************************************
	test("14.5.3.1.2 odata.fillUriTemplate: various constants", function () {
		return withMetaModel("/fake/annotations", function (oMetaModel) {
			var sMetaPath = sPath2BusinessPartner
					+ "/com.sap.vocabularies.UI.v1.Identification/4/Url/UrlRef",
				oCurrentContext = oMetaModel.getContext(sMetaPath),
				oRawValue = oMetaModel.getObject(sMetaPath);

			// Note: theoretically, each piece inserted into the template needs to be URI encoded,
			// this is only done where it actually makes a difference here
			strictEqual(formatAndParse(oRawValue, oCurrentContext),
				"#true/2015-03-24/"
				+ encodeURIComponent("2015-03-24T14:03:27Z")
				+ "/-123456789012345678901234567890.1234567890/-7.4503e-36"
				+ "/0050568D-393C-1ED4-9D97-E65F0F3FCC23/9007199254740992/"
				+ encodeURIComponent("hello, world")
				+ "/"
				+ encodeURIComponent("13:57:06"));
		});
	});

	//*********************************************************************************************
	[
		{type: "String", value: "foo\\bar", result: "'foo\\bar'"},
		{type: "Unsupported", value: "foo\\bar", error: true}
	].forEach(function (oFixture) {
		test("14.5.3.1.3 Function odata.uriEncode: " + JSON.stringify(oFixture.type), function () {
			if (oFixture.error) {
				this.mock(Basics).expects("error").once().throws(new SyntaxError());
			}

			return withMetaModel(function (oMetaModel) {
				var oExpectedResult,
					sMetaPath = sPath2BusinessPartner
						+ "/com.sap.vocabularies.UI.v1.Identification/0/Url/UrlRef",
					oCurrentContext = oMetaModel.getContext(sMetaPath),
					oRawValue = {
						Apply: {
							Name: "odata.uriEncode",
							Parameters: [{
								Type: oFixture.type,
								Value: oFixture.value
							}]
						}
					};

				oExpectedResult = oFixture.error
					? "Unsupported: " + Basics.toErrorString(oRawValue)
					: oFixture.result;
				strictEqual(formatAndParse(oRawValue, oCurrentContext), oExpectedResult);
			});
		});
	});

	//*********************************************************************************************
	test("14.5.3.1.3 Function odata.uriEncode", function () {
		return withMetaModel(function (oMetaModel) {
			var sMetaPath = sPath2BusinessPartner + "/com.sap.vocabularies.UI.v1.Identification/2"
					+ "/Url/UrlRef/Apply/Parameters/1/Value";

			testBinding(oMetaModel.getContext(sMetaPath), "'Domplatz'", {
				Address: {
					Street : "Domplatz",
					City : "Speyer"
				}
			});
		});
	});

	//*********************************************************************************************
	// Note: there is no Date type in v2, thus it cannot be encoded for URIs
	[ // see http://www.odata.org/documentation/odata-version-2-0/overview/
		{type: "Bool", result: "true"},
		//TODO split seconds, e.g. ".123456789012"
		{type: "DateTimeOffset", result: "datetimeoffset'2015-03-24T14:03:27Z'"},
		{type: "Decimal", result: "-123456789012345678901234567890.1234567890M"},
		{type: "Float", result: "-7.4503e-36d"},
		{type: "Guid", result: "guid'0050568D-393C-1ED4-9D97-E65F0F3FCC23'"},
		{type: "Int", result: "9007199254740992L"},
		{type: "String", result: "'hello, world'"},
		{type: "TimeOfDay", result: "time'13:57:06.123456789012'"}
	].forEach(function (oFixture, index) {
		test("14.5.3.1.3 odata.uriEncode of edm:" + oFixture.type, function () {
			return withMetaModel("/fake/annotations", function (oMetaModel) {
				var sMetaPath = sPath2BusinessPartner
						+ "/com.sap.vocabularies.UI.v1.Identification/5/Url/UrlRef/Apply/"
						+ "Parameters/" + (index + 1) + "/Value",
					oCurrentContext = oMetaModel.getContext(sMetaPath),
					oRawValue = oMetaModel.getObject(sMetaPath);

				strictEqual(formatAndParse(oRawValue, oCurrentContext), oFixture.result);
			});
		});
	});

	//*********************************************************************************************
	test("14.5.3.1.3 odata.uriEncode: various constants", function () {
		return withMetaModel("/fake/annotations", function (oMetaModel) {
			var sMetaPath = sPath2BusinessPartner
					+ "/com.sap.vocabularies.UI.v1.Identification/5/Url/UrlRef",
				oCurrentContext = oMetaModel.getContext(sMetaPath),
				oRawValue = oMetaModel.getObject(sMetaPath);

			strictEqual(formatAndParse(oRawValue, oCurrentContext), encodeURIComponent(
				// see http://www.odata.org/documentation/odata-version-2-0/overview/
				"true_"
				//TODO split seconds, e.g. ".123456789012"
				+ "datetimeoffset'2015-03-24T14:03:27Z'_"
				+ "-123456789012345678901234567890.1234567890M_"
				+ "-7.4503e-36d_"
				+ "guid'0050568D-393C-1ED4-9D97-E65F0F3FCC23'_"
				+ "9007199254740992L_"
				+ "'hello, world'_"
				+ "time'13:57:06.123456789012'"
			).replace(/'/g, "%27"));
		});
	});

	//*********************************************************************************************
	test("14.5.3 Nested apply (fillUriTemplate embeds uriEncode)", function () {
		return withMetaModel(function (oMetaModel) {
			var sMetaPath = sPath2BusinessPartner + "/com.sap.vocabularies.UI.v1.Identification/2"
					+ "/Url/UrlRef";

			testBinding(oMetaModel.getContext(sMetaPath),
				"https://www.google.de/maps/place/%27Domplatz%27,%27Speyer%27",
				{
					Address: {
						Street : "Domplatz",
						City : "Speyer"
					}
				});
		});
	});

	//*********************************************************************************************
	test("14.5.3 Nested apply (odata.fillUriTemplate & invalid uriEncode)", function () {
		this.mock(Basics).expects("error").once().throws(new SyntaxError());

		return withMetaModel(function (oMetaModel) {
			var sMetaPath = sPath2BusinessPartner + "/com.sap.vocabularies.UI.v1.Identification/2"
					+ "/Url/UrlRef",
				oCurrentContext = oMetaModel.getContext(sMetaPath),
				oRawValue = {
					Apply : {
						Name : "odata.fillUriTemplate",
						Parameters : [{
							Type: "String",
							Value: "http://foo.bar/{x}"
						}, {
							Name: "x",
							Value: {
								Apply: {Name: "odata.uriEncode"}
							}
						}]
					}
				};

			strictEqual(formatAndParse(oRawValue, oCurrentContext),
				"Unsupported: " + Basics.toErrorString(oRawValue));
		});
	});

	//*********************************************************************************************
	test("14.5.3 Nested apply (concat embeds concat & uriEncode)", function () {
		// This test is important to show that a nested concat must be expression
		return withMetaModel("/fake/annotations", function (oMetaModel) {
			var sMetaPath = sPath2BusinessPartner
					+ "/com.sap.vocabularies.UI.v1.Identification/1/Value";

			testBinding(oMetaModel.getContext(sMetaPath), "SAP 'SE'", {
				CompanyName: "SAP",
				LegalForm: "SE",
			});
		});
	});

	//*********************************************************************************************
	test("14.5.3 Nested apply (uriEncode embeds concat)", function () {
		return withMetaModel("/fake/annotations", function (oMetaModel) {
			var sMetaPath = sPath2BusinessPartner
					+ "/com.sap.vocabularies.UI.v1.Identification/2/Value";

			testBinding(oMetaModel.getContext(sMetaPath), "'SAP SE'", {
				CompanyName: "SAP",
				LegalForm: "SE",
			});
		});
	});

	//*********************************************************************************************
	test("14.5.1 Comparison and Logical Operators: part 1, comparison", function () {
		withMetaModel("/fake/annotations", function (oMetaModel) {
			var sMetaPath = sPath2BusinessPartner
					+ "/com.sap.vocabularies.UI.v1.Identification/6/Value",
				oCurrentContext = oMetaModel.getContext(sMetaPath),
				oRawValue = oMetaModel.getObject(sMetaPath);

			strictEqual(format(oRawValue, oCurrentContext),
				"{=((${p1}<${p2})===(${p4}>${p5}))&&((${p6}>=${p7})!==(${p8}<=${p9}))}");
		});
	});

	//*********************************************************************************************
	test("14.5.1 Comparison and Logical Operators: part 2, logical", function () {
		withMetaModel("/fake/annotations", function (oMetaModel) {
			var sMetaPath = sPath2BusinessPartner
					+ "/com.sap.vocabularies.UI.v1.Identification/7/Value",
				oCurrentContext = oMetaModel.getContext(sMetaPath),
				oRawValue = oMetaModel.getObject(sMetaPath);

			strictEqual(format(oRawValue, oCurrentContext),
				"{=(!(${p1}===${p2}))||((${p3}===${p4})&&(${p5}===${p6}))}");
		});
	});

	//*********************************************************************************************
	module("sap.ui.model.odata.AnnotationHelper.simplePath");

	//*********************************************************************************************
	test("forward to getExpression", function () {
		var oInterface = {},
			oRawValue = {},
			sResult = {};

		this.mock(Expression).expects("getExpression")
			.withExactArgs(oInterface, oRawValue, false).returns(sResult);

		strictEqual(AnnotationHelper.simplePath(oInterface, oRawValue), sResult, "result");
	});

	//*********************************************************************************************
	["", "/", ".", "foo", "{\\}", "path : 'foo'", 'path : "{\\f,o,o}"'].forEach(function (sPath) {
		test("14.5.12 Expression edm:Path: " + JSON.stringify(sPath), function () {
			var oMetaModel = new sap.ui.model.json.JSONModel({
					"Value" : {
						"Path" : sPath
					}
				}),
				sMetaPath = "/Value",
				oCurrentContext = oMetaModel.getContext(sMetaPath),
				oRawValue = oMetaModel.getProperty(sMetaPath),
				oSingleBindingInfo
					= formatAndParse(oRawValue, oCurrentContext, fnSimplePath);

			strictEqual(typeof oSingleBindingInfo, "object", "got a binding info");
			strictEqual(oSingleBindingInfo.path, sPath);
			strictEqual(oSingleBindingInfo.type, undefined);
			strictEqual(oSingleBindingInfo.constraints, undefined);

			if (sPath.indexOf(":") < 0 && fnEscape(sPath) === sPath) {
				// @see sap.ui.base.BindingParser: rObject, rBindingChars
				strictEqual(fnSimplePath(oCurrentContext, oRawValue), "{" + sPath + "}",
					"make sure that simple cases look simple");
			}
		});
	});

	//*********************************************************************************************
	module("sap.ui.model.odata.AnnotationHelper.followPath");

	//*********************************************************************************************
	[{
		// empty (annotation) path
		AnnotationPath : "",
		metaPath : sPath2Product + "/com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Target",
		navigationPath : "",
		resolvedPath : sPath2Product
	}, {
		// one navigation property, multiplicity "1"
		AnnotationPath : "ToSupplier",
		metaPath : sPath2Product + "/com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Target",
		entitySet : "BusinessPartnerSet",
		isMultiple : false,
		navigationPath : "ToSupplier",
		resolvedPath : sPath2BusinessPartner
	}, {
		// navigation property and term cast (typical use case!)
		AnnotationPath : "ToSupplier/@com.sap.vocabularies.Communication.v1.Address",
		metaPath : sPath2Product + "/com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Target",
		entitySet : "BusinessPartnerSet",
		isMultiple : false,
		navigationPath : "ToSupplier",
		resolvedPath : sPath2BusinessPartner + "/com.sap.vocabularies.Communication.v1.Address"
//	}, {
//		// annotation at navigation property itself
//TODO what exactly should happen in this case, can the path continue after this?
//		AnnotationPath : "ToSupplier@some.annotation.for.Navigation.Property",
//		metaPath : sPath2Product + "/com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Target",
//		entitySet : "BusinessPartnerSet",
//		isMultiple : false,
//		navigationPath : "ToSupplier",
//		resolvedPath :
//			sPath2Product + "/navigationProperty/1/some.annotation.for.Navigation.Property"
	}, {
		// many navigation properties, ToLineItems has multiplicity "*" but is not last!
		AnnotationPath
			: "ToLineItems/ToProduct/ToSupplier/ToContacts/@com.sap.vocabularies.UI.v1.HeaderInfo",
		metaPath : sPath2SalesOrder + "/com.sap.vocabularies.UI.v1.Facets/0/Target",
		entitySet : "ContactSet",
		isMultiple : Error,
		navigationPath : "ToLineItems/ToProduct/ToSupplier/ToContacts",
		resolvedPath : sPath2Contact + "/com.sap.vocabularies.UI.v1.HeaderInfo"
	}, {
		// single navigation property with multiplicity "*" and fantasy term cast
		AnnotationPath : "ToLineItems/@foo.Bar",
		metaPath : sPath2SalesOrder + "/com.sap.vocabularies.UI.v1.Facets/0/Target",
		entitySet : "SalesOrderLineItemSet",
		isMultiple : true,
		navigationPath : "ToLineItems",
		// decision: invalid path is usually OK for data binding
		resolvedPath : sPath2SalesOrderLineItem + "/foo.Bar"
	}, {
		// many navigation properties, multiplicity "*" as last one
		AnnotationPath : "ToProduct/ToSupplier/ToContacts/@com.sap.vocabularies.UI.v1.HeaderInfo",
		metaPath : sPath2SalesOrderLineItem + "/com.sap.vocabularies.UI.v1.Facets/0/Target",
		entitySet : "ContactSet",
		isMultiple : true,
		navigationPath : "ToProduct/ToSupplier/ToContacts",
		resolvedPath : sPath2Contact + "/com.sap.vocabularies.UI.v1.HeaderInfo"
	}, {
		// just a term cast with a qualifier
		AnnotationPath : "@com.sap.vocabularies.UI.v1.FieldGroup#Dimensions",
		metaPath : sPath2Product + "/com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Target",
		navigationPath : "",
		resolvedPath : sPath2Product + "/com.sap.vocabularies.UI.v1.FieldGroup#Dimensions"
	}, {
		// type cast syntax, not yet supported
		AnnotationPath : "unsupported.type.cast",
		metaPath : sPath2Product + "/com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Target",
		navigationPath : "",
		resolvedPath : undefined
	}, {
		// some invalid property
		AnnotationPath : "invalid_property",
		metaPath : sPath2Product + "/com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Target",
		navigationPath : "",
		resolvedPath : undefined
	}, {
		// Note: suffix after unsupported path is ignored
		AnnotationPath : "invalid_property/@some.Annotation",
		metaPath : sPath2Product + "/com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Target",
		navigationPath : "",
		resolvedPath : undefined
	}, {
		// structural property
		Path : "Address",
		metaPath : sPath2BusinessPartner + "/com.sap.vocabularies.Communication.v1.Address/street",
		navigationPath : "",
		resolvedPath : sPath2BusinessPartner + "/property/0"
	}, {
		// structural property of complex type
		Path : "Address/Street",
		metaPath : sPath2BusinessPartner + "/com.sap.vocabularies.Communication.v1.Address/street",
		navigationPath : "",
		resolvedPath : "/dataServices/schema/0/complexType/0/property/2"
	}].forEach(function (oFixture) {
		var sPath, sTitle;

		if (oFixture.hasOwnProperty("AnnotationPath")) {
			sPath = oFixture.AnnotationPath;
			sTitle = "14.5.2 Expression edm:AnnotationPath: " + sPath;
		} else if (oFixture.hasOwnProperty("Path")) {
			sPath = oFixture.Path;
			sTitle = "14.5.12 Expression edm:Path: " + sPath;
		}

		if (oFixture.navigationPath === "") {
			// w/o a navigation path, these cannot have a different value
			oFixture.entitySet = undefined;
			oFixture.isMultiple = false;
		}

		test(sTitle, function () {
			return withMetaModel(function (oMetaModel) {
				var oContext = oMetaModel.createBindingContext(oFixture.metaPath),
					oRawValue = oMetaModel.getProperty(oFixture.metaPath),
					oSingleBindingInfo;

				if (oRawValue) {
					// evil, test code only: write into ODataMetaModel
					delete oRawValue.AnnotationPath;
					delete oRawValue.Path;
					if (oFixture.hasOwnProperty("AnnotationPath")) {
						oRawValue.AnnotationPath = oFixture.AnnotationPath;
					} else if (oFixture.hasOwnProperty("Path")) {
						oRawValue.Path = oFixture.Path;
					}
				}

				// getNavigationPath
				oSingleBindingInfo
					= formatAndParse(oRawValue, oContext, fnGetNavigationPath);

				strictEqual(typeof oSingleBindingInfo, "object",
					"getNavigationPath: got a binding info");
				strictEqual(oSingleBindingInfo.path, oFixture.navigationPath, "getNavigationPath");
				strictEqual(oSingleBindingInfo.type, undefined, "getNavigationPath: no type");

				// gotoEntitySet
				strictEqual(AnnotationHelper.gotoEntitySet(oContext),
					oFixture.entitySet
						? oMetaModel.getODataEntitySet(oFixture.entitySet, true)
						: undefined,
					"gotoEntitySet");

				// isMultiple
				if (oFixture.isMultiple === Error) {
					try {
						formatAndParse(oRawValue, oContext, fnIsMultiple);
						ok(false, "Exception expected");
					} catch (e) {
						strictEqual(e.message,
							'Association end with multiplicity "*" is not the last one: ' + sPath);
					}
				} else {
					strictEqual(formatAndParse(oRawValue, oContext, fnIsMultiple),
						String(oFixture.isMultiple), "isMultiple");
				}

				// resolvePath
				strictEqual(AnnotationHelper.resolvePath(oContext), oFixture.resolvedPath,
					"resolvePath");
			});
		});
	});

	//*********************************************************************************************
	[{
		// invalid meta path
		metaPath : "/foo",
		isMultiple : "",
		navigationPath : undefined,
		resolvedPath : undefined
	}, {
		// valid meta path, but raw value will be empty
		metaPath : sPath2Product + "/com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Target",
		isMultiple : "",
		navigationPath : undefined,
		resolvedPath : undefined
	}, {
		// valid meta path, but outside of entity type
		metaPath : "/dataServices/schema/0/@foo.Bar",
		isMultiple : "",
		navigationPath : undefined,
		resolvedPath : undefined
	}].forEach(function (oFixture) {
		test("Missing path expression, context: " + oFixture.metaPath, function () {
			return withMetaModel(function (oMetaModel) {
				var oContext = oMetaModel.createBindingContext(oFixture.metaPath),
					oRawValue = oMetaModel.getProperty(oFixture.metaPath);

				if (oRawValue) {
					// evil, test code only: write into ODataMetaModel
					delete oRawValue.AnnotationPath;
				} else if (oFixture.metaPath = "/dataServices/schema/0/@foo.Bar") {
					oRawValue = {
						"AnnotationPath" : "n/a"
					};
					oMetaModel.getProperty("/dataServices/schema/0")["foo.Bar"] = oRawValue;
				}

				// getNavigationPath
				strictEqual(AnnotationHelper.getNavigationPath(oContext, oRawValue), "",
					"getNavigationPath");

				// gotoEntitySet
				strictEqual(AnnotationHelper.gotoEntitySet(oContext), undefined, "gotoEntitySet");

				// isMultiple
				strictEqual(formatAndParse(oRawValue, oContext, fnIsMultiple), "",
					"isMultiple");

				// resolvePath
				strictEqual(AnnotationHelper.resolvePath(oContext), undefined, "resolvePath");
			});
		});
	});

	//TODO support type cast
	//TODO support term casts to odata.mediaEditLink, odata.mediaReadLink, odata.mediaContentType?
	//TODO support $count

	//TODO support annotations embedded within entity container, entity set (or singleton?),
	// complex type, property of entity or complex type

	// TODO improve error handling: unsupported within apply function gives unreadable result and
	// should be avoided, illegalValue should report the full binding path and not only the last
	// property which is most probably "String", "Path" or "Value"

	//*********************************************************************************************
	module("sap.ui.model.odata.AnnotationHelper.gotoEntityType");

	//*********************************************************************************************
	test("gotoEntityType called directly on the entity type's qualified name", function () {
		return withMetaModel(function (oMetaModel) {
			var sMetaPath = "/dataServices/schema/0/entityContainer/0/entitySet/0/entityType",
				sQualifiedName = "GWSAMPLE_BASIC.BusinessPartner",
				oContext = oMetaModel.createBindingContext(sMetaPath);

			strictEqual(oMetaModel.getProperty(sMetaPath), sQualifiedName);

			strictEqual(AnnotationHelper.gotoEntityType(oContext),
				oMetaModel.getODataEntityType(sQualifiedName, true));
		});
	});

	//*********************************************************************************************
	module("sap.ui.model.odata.AnnotationHelper.gotoEntitySet");

	//*********************************************************************************************
	test("gotoEntitySet called directly on the entity set's name", function () {
		return withMetaModel(function (oMetaModel) {
			var sMetaPath
					= "/dataServices/schema/0/entityContainer/0/associationSet/1/end/1/entitySet",
				oContext = oMetaModel.createBindingContext(sMetaPath);

			strictEqual(oMetaModel.getProperty(sMetaPath), "ProductSet");

			strictEqual(AnnotationHelper.gotoEntitySet(oContext),
				oMetaModel.getODataEntitySet("ProductSet", true));
		});
	});
});
