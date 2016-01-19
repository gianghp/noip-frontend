<cffile action="read" variable="str" file="D:\namdt\projects\lamsonportal\portal\chat\smileys\emoticons.xml">

<cfset ii = 0>
<cfloop condition="true">
	<cfset j1 = find('fname="', str)>
	<cfif j1 eq 0><cfbreak></cfif>
	
	<cfset str = mid(str, j1 + 7, 1000000)>
	<cfset j1 = find('"', str)>
	<cfset fname = mid(str, 1, j1-1)>
	<cfset str = mid(str, j1, 100000)>	
	
	<cfset j1 = find('<shortcut>', str)>
	<cfset str = mid(str, j1 + 10, 1000000)>
	<cfset j1 = find('<', str)>
	<cfset sc = mid(str, 1, j1-1)>
	<cfset str = mid(str, j1, 100000)>	
	
	
	<cfset sc = REReplace(sc, "##", "####", "all")>
	<cfoutput>#sc# <!---&lt;cfset strtext = REReplace(strtext, "#sc#", "&lt;img src='/chat/smileys/#fname#.gif' /&gt;", "all")&gt;	<br />---></cfoutput>
</cfloop>

<cffunction name="getHtmlSmileys">
	<cfargument name="strtext" default="" type="string">
	<cfset strtext = REReplace(strtext, ":)", "<img src='/chat/smileys/1.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ":(", "<img src='/chat/smileys/2.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ";)", "<img src='/chat/smileys/3.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ":-/", "<img src='/chat/smileys/7.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ":x", "<img src='/chat/smileys/8.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ':">', "<img src='/chat/smileys/9.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ":-P", "<img src='/chat/smileys/10.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ":-*", "<img src='/chat/smileys/11.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "=((", "<img src='/chat/smileys/12.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ":-O", "<img src='/chat/smileys/13.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "X-(", "<img src='/chat/smileys/14.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "B-)", "<img src='/chat/smileys/16.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ">:)", "<img src='/chat/smileys/19.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ":((", "<img src='/chat/smileys/20.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ":|", "<img src='/chat/smileys/22.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "/:)", "<img src='/chat/smileys/23.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "o:-)", "<img src='/chat/smileys/25.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ":-B", "<img src='/chat/smileys/26.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "8-|", "<img src='/chat/smileys/29.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ":-&", "<img src='/chat/smileys/31.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ":-$", "<img src='/chat/smileys/32.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "", "<img src='/chat/smileys/36.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "(:|", "<img src='/chat/smileys/37.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ":-?", "<img src='/chat/smileys/39.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ":))", "<img src='/chat/smileys/21.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "=))", "<img src='/chat/smileys/24.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ":D", "<img src='/chat/smileys/4.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ";;)", "<img src='/chat/smileys/5.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "", "<img src='/chat/smileys/6.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ":->", "<img src='/chat/smileys/15.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ":-S", "<img src='/chat/smileys/17.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "##:-S", "<img src='/chat/smileys/18.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "=;", "<img src='/chat/smileys/27.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "I-)", "<img src='/chat/smileys/28.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "L-)", "<img src='/chat/smileys/30.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "[-(", "<img src='/chat/smileys/33.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ":o)", "<img src='/chat/smileys/34.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "8-}", "<img src='/chat/smileys/35.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "=P~", "<img src='/chat/smileys/38.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "##-o", "<img src='/chat/smileys/40.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "=D>", "<img src='/chat/smileys/41.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ":-SS", "<img src='/chat/smileys/42.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "@-)", "<img src='/chat/smileys/43.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ":^O", "<img src='/chat/smileys/44.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ":-w", "<img src='/chat/smileys/45.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ";-", "<img src='/chat/smileys/46.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ">:P", "<img src='/chat/smileys/47.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "", "<img src='/chat/smileys/48.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ":)]", "<img src='/chat/smileys/100.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ":-c", "<img src='/chat/smileys/101.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "~x(", "<img src='/chat/smileys/102.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ":-h", "<img src='/chat/smileys/103.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ":-t", "<img src='/chat/smileys/104.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "8->", "<img src='/chat/smileys/105.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ":-??", "<img src='/chat/smileys/106.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "%-(", "<img src='/chat/smileys/107.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ":o3", "<img src='/chat/smileys/108.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "X_X", "<img src='/chat/smileys/109.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ":!!", "<img src='/chat/smileys/110.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "\m/", "<img src='/chat/smileys/111.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ":@)", "<img src='/chat/smileys/49.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "3:-O", "<img src='/chat/smileys/50.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ":(|)", "<img src='/chat/smileys/51.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "~:>", "<img src='/chat/smileys/52.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "@};-", "<img src='/chat/smileys/53.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "%%-", "<img src='/chat/smileys/54.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "**==", "<img src='/chat/smileys/55.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "(~~)", "<img src='/chat/smileys/56.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "~o)", "<img src='/chat/smileys/57.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "*-:)", "<img src='/chat/smileys/58.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "8-X", "<img src='/chat/smileys/59.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "=:)", "<img src='/chat/smileys/60.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ">-)", "<img src='/chat/smileys/61.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ":-L", "<img src='/chat/smileys/62.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "[-O", "<img src='/chat/smileys/63.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "$-)", "<img src='/chat/smileys/64.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ':-"', "<img src='/chat/smileys/65.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "b-(", "<img src='/chat/smileys/66.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ":)>-", "<img src='/chat/smileys/67.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "[-X", "<img src='/chat/smileys/68.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ":D/", "<img src='/chat/smileys/69.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ">:/", "<img src='/chat/smileys/70.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ";))", "<img src='/chat/smileys/71.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "o->", "<img src='/chat/smileys/72.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "o=>", "<img src='/chat/smileys/73.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "o-+", "<img src='/chat/smileys/74.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "(%)", "<img src='/chat/smileys/75.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ":-@", "<img src='/chat/smileys/76.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "^:)^", "<img src='/chat/smileys/77.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ":-j", "<img src='/chat/smileys/78.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "(*)", "<img src='/chat/smileys/79.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ":-q", "<img src='/chat/smileys/112.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ":-bd", "<img src='/chat/smileys/113.gif' />", "all")>
	<cfset strtext = REReplace(strtext, "^##(^", "<img src='/chat/smileys/114.gif' />", "all")>
	<cfset strtext = REReplace(strtext, ":bz", "<img src='/chat/smileys/115.gif' />", "all")>  
	<cfreturn strtext>
</cffunction>
