var MAKE_FASTER=false,D_MIN_MOVES,D_MAX_MOVES,D_MIN_SUM,D_MAX_SUM,foundMoves=[],foundMovesArrows=[],foundMovesArrows2=[],foundMovesArrows3=[],stonesCols=[],stonesRows=[],freeCols=[],freeRows=[],freeByCol=[],freeByRow=[],totalMarbles,emptySquares,badMarbles;function initStoneCounts(){stonesCols=[];stonesRows=[];for(var a=0;a<board[0].length;a++)stonesCols[a]=0;for(a=0;a<board.length;a++)stonesRows[a]=0}function dumpStoneCounts(){return"cols ["+stonesCols+"] rows ["+stonesRows+"]"}
var arrows=[],arrowBoard=[],arrowsItems=[],arrowsItemsLengths=[],numArrows,autosolveSteps,autosolveStepsByMove,autosolveStepsSum,freeSpots=[];function initArrows(){arrows=[];posToArrows=[]}function arrowsSet(a,b,e,f){arrows[[a,b]]||(arrows[[a,b]]=[]);arrows[[a,b]][e]=f}function arrowsAdd(a,b,e,f){arrows[[a,b]]||(arrows[[a,b]]=[]);arrows[[a,b]][e]||(arrows[[a,b]][e]=[]);arrows[[a,b]][e][f]=f}
function arrowsDump(){var a="",b;for(b in arrows){a+="["+b+"] sat ["+arrows[b].sat+"] path [";for(var e in arrows[b].path)a+=arrows[b].path[e]+" ";a+="] rows [";for(e in arrows[b].rows)a+=arrows[b].rows[e]+" ";a+="] srows ["+arrows[b].srows+"] cols [";for(e in arrows[b].cols)a+=arrows[b].cols[e]+" ";a+="] scols ["+arrows[b].scols+"<br>"}return a}function arrowPathUnfilledOBSOLETE(a,b){delta=inc(a,b);return itemsFrom(0,a,b,delta[0],delta[1])}
function pathsIntersect(a,b){for(var e in b)if(a[e])return true}function listsIntersect(a,b){if(a.length==0||b.length==0)return false;for(var e=[],f=0;f<a.length;f++)e[a[f]]=a[f];for(f=0;f<b.length;f++)if(e[b[f]])return true;return false}function listsSubset(a,b){if(a.length==0||b.length==0)return false;for(var e=[],f=0;f<b.length;f++)e[b[f]]=b[f];for(f=0;f<a.length;f++)if(!e[a[f]])return false;return true}
function arrowSubset(a,b,e){var f;if(DEBUG)f="arrowsSubset "+a+" "+b+": A[";e=e?"rows":"cols";a=arrows[a][e];b=arrows[b][e];if(DEBUG){for(var h in a)f+=h+" ";f+="] B[";for(h in b)f+=h+" ";f+="]";debug(f)}f=false;for(h in b){f=true;if(!a[h])return false}return f}
function invCrossings(a,b){var e="",f=[],h=[];if(DEBUG)e+="set [";for(var g in a){if(DEBUG)e+=g+" ";if(b)h[parseInt(g.split(",")[0])]=true;else h[parseInt(g.split(",")[1])]=true}if(DEBUG)e+="] region [";for(g in h){if(DEBUG)e+=g+", ";if(b)for(var i=1;i<board[0].length;i++){if(!a[[g,i]]&&board[g][i]==0)f[f.length]=[g,i]}else for(i=1;i<board.length;i++)if(!a[[i,g]]&&board[i][g]==0)f[f.length]=[i,g]}DEBUG&&debug(e+"]");return f}
function updateArrows(a,b,e){dbug="";if(a){initArrows();arrowsFind()}else{if(b==null||e==null)a=arrows;else{a=[];b=arrowBoard[b][e];for(e=0;e<b.length;e++)a[b[e]]=b[e]}for(var f in a){b=fromKey(f);e=b[0];var h=b[1];arrows[f].path=[];arrows[f].rows=[];arrows[f].cols=[];var g=0,i=null;inc(e,h);g=arrowsItemsLengths[f][5];i=arrowsItems[f][0];arrowsSet(e,h,"sat",g>0);marka&&renderSat(e,h,g>0);if(!MAKE_FASTER){for(var j in i){b=fromKey(j);if(b[0]!=e||b[1]!=h){arrowsAdd(e,h,"path",b);arrowsAdd(e,h,"rows",
b[0]);arrowsAdd(e,h,"cols",b[1]);if(DEBUG)dbug+=" ar["+b[0]+"] ac["+b[1]+"] "}}g=0;for(var l in arrows[[e,h]].rows)g+=stonesRows[l];arrowsSet(e,h,"srows",g);g=0;for(l in arrows[[e,h]].cols)g+=stonesCols[l];arrowsSet(e,h,"scols",g);if(DEBUG)dbug+=b+", "+g+", "+i+"; <br>"}}html="";autosolve||debug(arrowsDump()+dbug)}}function renderSat(a,b,e){var f=d("r"+a+"c"+b).className;d("r"+a+"c"+b).className=(e?"m":"s")+f.substring(1)}
function arrowsFind(){freeSpots=[];numArrows=0;for(var a=1;a<board.length;a++){arrowBoard[a]=[];for(var b=1;b<board[0].length;b++){arrowBoard[a][b]=[];if(isArrow(a,b)){arrowsSet(a,b,"sat",false);numArrows++}else if(isFree(a,b))freeSpots[[a,b]]=[a,b]}}arrowsItems=[];arrowsItemsLengths=[];for(var e in arrows){arrowsItems[e]=[];arrowsItems[e][0]=[];arrowsItems[e][1]=[];arrowsItems[e][5]=[];arrowsItems[e][10]=[];arrowsItemsLengths[e]=[];arrowsItemsLengths[e][0]=0;arrowsItemsLengths[e][1]=0;arrowsItemsLengths[e][5]=
0;arrowsItemsLengths[e][10]=0;a=fromKey(e);b=inc(a[0],a[1]);for(var f=itemsFrom(0,a[0],a[1],b[0],b[1]),h=0;h<f.length;h++){var g=arrowBoard[f[h][0]][f[h][1]];g[g.length]=e;arrowsItemsAdd(e,0,f[h][0],f[h][1])}f=itemsFrom(5,a[0],a[1],b[0],b[1]);for(h=0;h<f.length;h++){g=arrowBoard[f[h][0]][f[h][1]];g[g.length]=e;arrowsItemsAdd(e,5,f[h][0],f[h][1])}f=itemsFrom(10,a[0],a[1],b[0],b[1]);for(h=0;h<f.length;h++)arrowsItemsAdd(e,10,f[h][0],f[h][1])}}
function arrowsItemsAdd(a,b,e,f){arrowsItems[a][b][[e,f]]=[e,f];arrowsItemsLengths[a][b]++}function arrowsItemsDel(a,b,e,f){arrowsItems[a]||alert(a);delete arrowsItems[a][b][[e,f]];arrowsItemsLengths[a][b]--}function arrowsItemsUpdate(a,b,e,f){for(var h=0;h<arrowBoard[e][f].length;h++){arrowsItemsDel(arrowBoard[e][f][h],a,e,f);arrowsItemsAdd(arrowBoard[e][f][h],b,e,f)}}
function movesFreeEqualsCount(){for(var a=[],b=1;b<board.length;b++){var e=0,f=items(0,b,true);e=items(5,b,true);if(f.length>0){e=f.length+e.length;if(e>0&&e==board[b][0]){a[a.length]=f;if(greedy)return a}}}for(b=1;b<board[0].length;b++){f=items(0,b,false);e=items(5,b,false);if(f.length>0){e=f.length+e.length;if(e>0&&e==board[0][b]){a[a.length]=f;if(greedy)break}}}return a}
function movesUnfilled(){for(var a=[],b=1;b<board.length;b++){var e=items(5,b,true),f=items(0,b,true);if(f.length>0)if(e.length==board[b][0]){a[a.length]=f;if(greedy)return a}}for(b=1;b<board.length;b++){e=items(5,b,false);f=items(0,b,false);if(f.length>0)if(e.length==board[0][b]){a[a.length]=f;if(greedy)break}}return a}function fromKey(a){return[parseInt(a.split(",")[0]),parseInt(a.split(",")[1])]}
function movesOne(){var a=[],b;for(b in arrows)if(!arrows[b].sat){rc=fromKey(b);row=rc[0];col=rc[1];board[row]||alert(b+","+row);if(board[row][col]==4||board[row][col]==6){var e=stonesRows[row];if(board[row][0]-e==1){filled=[];if(board[row][col]==4)for(e=col+1;e<board[0].length;e++){if(isFree(row,e))filled[filled.length]=[row,e]}else if(board[row][col]==6)for(e=col-1;e>0;e--)if(isFree(row,e))filled[filled.length]=[row,e];if(filled.length>0){a[a.length]=filled;if(greedy)break}}}if(board[row][col]==
8||board[row][col]==2){e=stonesCols[col];if(board[0][col]-e==1){filled=[];if(board[row][col]==2)for(e=row-1;e>0;e--){if(isFree(e,col))filled[filled.length]=[e,col]}else if(board[row][col]==8)for(e=row+1;e<board.length;e++)if(isFree(e,col))filled[filled.length]=[e,col];if(filled.length>0){a[a.length]=filled;if(greedy)break}}}}return a}
function movesOneUnfilled(){html="";var a=[],b;for(b in arrows)if(!arrows[b].sat){row=parseInt(b.split(",")[0]);col=parseInt(b.split(",")[1]);var e=arrowsItemsLengths[b][0];if(DEBUG)html+=row+","+col+": "+e+"<br>";if(e==1)for(var f in arrowsItems[b][0]){a[a.length]=[fromKey(f)];if(greedy)return a}}DEBUG&&debug("oneUnfilled "+html);return a}
function movesTwo(){for(var a=[],b=1;b<board.length;b++){for(var e=false,f=-1,h=false,g=-1,i=1;i<board[0].length;i++){var j=board[b][i];if(j==5&&!e)break;if(j==4){e=true;f=i}if(e&&j==6){if(arrows[[b,i]].sat)break;h=true;g=i;break}}if(e&&h&&board[b][0]-stonesRows[b]==2){e=[];for(f=f+1;f<g;f++)if(board[b][f]==0)e[e.length]=[b,f];if(e.length>0)a[a.length]=e}}for(i=1;i<board[0].length;i++){e=false;f=-1;h=false;g=-1;for(b=1;b<board.length;b++){j=board[b][i];if(j==5&&!e)break;if(j==8){e=true;f=b}if(e&&
j==2){if(arrows[[b,i]].sat)break;h=true;g=b;break}}if(e&&h&&board[0][i]-stonesCols[i]==2){e=[];for(f=f+1;f<g;f++)if(board[f][i]==0)e[e.length]=[f,i];if(e.length>0)a[a.length]=e}}return a}
function movesPathCount(){var a=[];if(MAKE_FASTER)return a;var b="",e;foundMovesArrows=[];for(var f in arrows)if(!arrows[f].sat){var h=1,g=[];merge(g,arrows[f].path);e=[];e[e.length]=fromKey(f);for(var i in arrows)if(arrows[i].sat){if(DEBUG)b+=i+" is sat "}else if(i!=f){if(DEBUG)b+="<br>rows: "+f+","+i+"; ";if(arrowSubset(f,i,true)){if(DEBUG)b+="A sub B; ";if(!pathsIntersect(g,arrows[i].path)){h++;e[e.length]=fromKey(i);merge(g,arrows[i].path);if(DEBUG)b+=" no intersect; N="+h+", M="+g+"; srows = "+
arrows[f].srows+"; numStones "+numStones(f,true)+"; pointersLen "+e.length;if(h==numStones(f,true)-arrows[f].srows){var j=invCrossings(g,true);if(j.length>0){a[a.length]=j;foundMovesArrows[foundMovesArrows.length]=e.slice(0);if(greedy)return a;if(DEBUG)b+=" found moves; arrow pointers length: "+foundMovesArrows[foundMovesArrows.length-1].length;e=[]}}}}}h=1;g=[];merge(g,arrows[f].path);e=[];e[e.length]=fromKey(f);for(i in arrows)if(arrows[i].sat){if(DEBUG)b+=i+" is sat "}else if(i!=f){if(DEBUG)b+=
"<br>cols: "+f+","+i+"; ";if(arrowSubset(f,i,false)){if(DEBUG)b+="A sub B; ";if(!pathsIntersect(g,arrows[i].path)){h++;e[e.length]=fromKey(i);merge(g,arrows[i].path);if(DEBUG)b+=" no intersect; N="+h+", M="+g+"; scols = "+arrows[f].scols+"; numStones "+numStones(f,false)+"; pointersLen "+e.length;if(h==numStones(f,false)-arrows[f].scols){j=invCrossings(g,false);if(j.length>0){a[a.length]=j;foundMovesArrows[foundMovesArrows.length]=e.slice(0);if(greedy)return a;if(DEBUG)b+=" found moves; arrow pointers length: "+
foundMovesArrows[foundMovesArrows.length-1].length;e=[]}}}}}}debug("movesPathCount "+b);return removeDupes(a,true)}function removeDupes(a,b){for(var e=[],f=[],h=[],g=0;g<a.length;g++){var i=""+a[g];if(!e[i]){e[i]=i;f[f.length]=a[g];if(b)h[h.length]=foundMovesArrows[g]}}if(b)foundMovesArrows=h;return f}function merge(a,b){for(var e in b)a[e]=e}function numStones(a,b){var e=0;if(b){for(var f in arrows[a].rows)e+=board[f][0];return e}for(var h in arrows[a].cols)e+=board[0][h];return e}
function movesImpossible(){debug("movesImpossible");var a=[];foundMovesArrows2=[];for(var b in freeSpots){var e=fromKey(b);debug("rc "+e);var f=e[0];e=e[1];if(board[f][e]==0){stonesCols[e]++;stonesRows[f]++;for(var h in arrows){var g=false;debug(" next arrow "+h);if(arrows[h].sat)debug(" arrow is sat ");else{g=true;var i=arrowsItems[h][0],j;for(j in i){var l=fromKey(j);g=l[0];l=l[1];debug("impossible "+arrowsItemsLengths[h][0]+"; "+f+","+e+"; sc"+stonesCols[e]+" sr"+stonesRows[f]+" a"+h+" free r"+
g+"c"+l+" b0c "+board[0][l]+" sc"+stonesCols[l]+" br0 "+board[g][0]+" sr"+stonesRows[g]+" "+(board[0][l]>0&&board[0][l]-stonesCols[l]==0?"y":"n")+" "+(board[g][0]>0&&board[g][0]-stonesRows[g]==0?"y":"n"));if(g==f&&l==e){g=true;break}if(board[0][l]>0&&board[0][l]-stonesCols[l]==0)g=false;else if(board[g][0]>0&&board[g][0]-stonesRows[g]==0)g=false;else{g=true;break}}if(!g){debug("found one at "+[f,e]);a[a.length]=[[f,e]];foundMovesArrows2[foundMovesArrows2.length]=[fromKey(h)];break}}}stonesCols[e]--;
stonesRows[f]--}}return a}function movesPigeonHole(){var a=[];if(MAKE_FASTER)return a;foundMovesArrows3=[];for(var b=1;b<board.length;b++)movesPigeonHoleSub(a,b,true);if(greedy&&a.length>0)return a;for(b=1;b<board[0].length;b++)movesPigeonHoleSub(a,b,false);return a}
function movesPigeonHoleSub(a,b,e){var f;if(DEBUG)f="pigeon ";var h=e?board[b][0]-stonesRows[b]:board[0][b]-stonesCols[b];if(DEBUG)f+="X "+b+" row "+e+" N "+h;for(var g=e?board[b].length:board.length,i=0,j=[],l=[],k=1;k<g;k++){var m=e?board[b][k]:board[k][b];if(m==0){i++;m=e?[b,k]:[k,b];j[m]=m;if((e?board[0][k]:board[k][0])-(e?stonesCols[k]:stonesRows[k])==1)l[l.length]=k}}if(DEBUG)f+=" M "+i+" P "+dump(j)+" S "+l;debug(f);f="";b=[];g=0;var q=[],p;for(p in arrows)if(!arrows[p].sat){k=arrows[p].path;
var o=[],n;for(n in k){m=fromKey(n);if(DEBUG)f+=" key "+n+" fk[1] "+m[1]+" fk[0] "+m[0];m=e?m[1]:m[0];o[o.length]=m}if(DEBUG)f+="<br>arrow "+p+", s "+o;for(n in k)f+=" p["+n+"]="+k[n];for(n in j)f+=" P["+n+"]="+j[n];if(DEBUG)f+="<br> bools ["+!listsIntersect(o,b)+"]["+listsSubset(o,l)+"]["+!pathsIntersect(k,j)+"]<br>";if(!listsIntersect(o,b)&&listsSubset(o,l)&&!pathsIntersect(k,j)){q[q.length]=fromKey(p);g++;for(k=0;k<o.length;k++)b[o[k]]=o[k];if(DEBUG)f+=" count "+g+" R "+dump(b)+" count == M-N? "+
(g==i-h);if(g==i-h){k=[];for(n in j){m=e?j[n][1]:j[n][0];if(DEBUG)f+=" key "+n+" val "+m+" R[val] "+b[m]+" P[key] "+j[n];b[m]||(k[k.length]=j[n])}if(k.length>0){a[a.length]=k;if(DEBUG)f+=" moveList "+k+" a "+q;foundMovesArrows3[foundMovesArrows3.length]=q.slice(0);if(greedy)return a;break}}}}debug(f)}function unsat(){for(var a in arrows)if(!arrows[a].sat)if(!arrowsItemsLengths[a][0])return true;return false}
function findMoves(){if(doMoves){foundMoves=[];addMoves(movesFreeEqualsCount());if(!(greedy&&foundMoves.length>0&&foundMoves[0].length>0)){addMoves(movesUnfilled());if(!(greedy&&foundMoves.length>0&&foundMoves[1].length>0)){addMoves(movesOne());if(!(greedy&&foundMoves.length>0&&foundMoves[2].length>0)){addMoves(movesOneUnfilled());if(!(greedy&&foundMoves.length>0&&foundMoves[3].length>0)){addMoves(movesTwo());if(!(greedy&&foundMoves.length>0&&foundMoves[4].length>0))if(foundMoves[0].length+foundMoves[1].length+
foundMoves[2].length+foundMoves[3].length+foundMoves[4].length==0){addMoves(movesPathCount());if(greedy&&foundMoves.length>0&&foundMoves[5].length>0){showMoves();dumpDebug();return}addMoves(movesImpossible());if(greedy&&foundMoves.length>0&&foundMoves[6].length>0){showMoves();dumpDebug();return}addMoves(movesPigeonHole())}}}}}showMoves();dumpDebug()}}function addMoves(a){foundMoves[foundMoves.length]=a}
function showMoves(){if(!autosolve){html="";for(var a=0;a<foundMoves.length;a++)if(foundMoves[a]&&foundMoves[a].length>0)for(var b=0;b<foundMoves[a].length;b++)html+="move "+a+" "+itemName(itemType(a))+' <a href="javascript:makeMoves(itemType('+a+"), "+a+","+b+')" onmouseover="hm('+a+","+b+')" onmouseout="hm('+a+","+b+')">['+foundMoves[a][b]+"]</a> <br>";d("moves").innerHTML=html}}
function hm(a,b){for(var e=0;e<foundMoves[a][b].length;e++)highlight(foundMoves[a][b][e][0],foundMoves[a][b][e][1]);if(a==5)for(e=0;e<foundMovesArrows[b].length;e++)highlight(foundMovesArrows[b][e][0],foundMovesArrows[b][e][1]);if(a==6)for(e=0;e<foundMovesArrows2[b].length;e++)highlight(foundMovesArrows2[b][e][0],foundMovesArrows2[b][e][1]);if(a==7)for(e=0;e<foundMovesArrows3[b].length;e++)highlight(foundMovesArrows3[b][e][0],foundMovesArrows3[b][e][1])}
function itemType(a){if(a==0)return 5;if(a==1)return 10;if(a==2)return 10;if(a==3)return 5;if(a==4)return 10;if(a==5)return 10;if(a==6)return 10;if(a==7)return 5}function makeMoves(a,b,e){performMoves(a,foundMoves[b][e])}function goSolve(a){a&&reset();SYMMETRY_TYPE=symmetryType(solution);solve()}
function solve(){autosolve=true;autosolveSteps=0;autosolveStepsByMove=[];for(var a=autosolveStepsSum=0;a<8;a++)autosolveStepsByMove[a]=0;var b=greedy=false,e,f,h;do if(won)b=true;else{b=true;autosolveStepsSum+=foundMoves[0].length+foundMoves[1].length+foundMoves[2].length+foundMoves[3].length+foundMoves[4].length;f=-1;for(a=e=0;a<5;a++)if(foundMoves[a])for(var g=0;g<foundMoves[a].length;g++)if(foundMoves[a][g].length>e){f=a;h=g;e=foundMoves[a][g].length}if(f==-1)if(foundMoves[5]&&foundMoves[5].length>
0){f=5;h=0}else if(foundMoves[6]&&foundMoves[6].length>0){f=6;h=0}else if(foundMoves[7]&&foundMoves[7].length>0){f=7;h=0}if(f>-1){makeMoves(itemType(f),f,h);autosolveSteps++;autosolveStepsByMove[f]++;b=false}}while(!b);autosolve=false;doRender&&render();checkWin();d("moves").innerHTML+="Total Moves: ["+autosolveSteps+"] Moves by type: ["+autosolveStepsByMove+"] Available moves sum: ["+autosolveStepsSum+"]"}
function items(a,b,e){c=r=1;dc=dr=0;if(e){r=b;dc=1}else{c=b;dr=1}return itemsFrom(a,r,c,dr,dc)}function itemsFrom(a,b,e,f,h){found=[];if(f==0&&h==0)alert("deltas were zero. "+a+";"+b+","+e);else{for(;b<board.length&&e<board[0].length&&b>0&&e>0;){if(a==-1||board[b][e]==a)found[found.length]=[b,e];b+=f;e+=h}return found}}function infoRowText(a){for(var b="",e=0;e<a.length;e++)b+=a[e]+"\t";return b}
function infoRow(){reset();SYMMETRY_TYPE=symmetryType(solution);solve();var a=[];a[a.length]=unsolved();a[a.length]=SYMMETRY_TYPE;a[a.length]=difficultyName(difficulty());a[a.length]=difficultyLevel();a[a.length]=autosolveSteps;a[a.length]=autosolveStepsSum;for(var b=0;b<autosolveStepsByMove.length;b++)a[a.length]=autosolveStepsByMove[b];a[a.length]=movesEasy();a[a.length]=movesHard();a[a.length]=numArrows;a[a.length]=dumpPuzzle(2);a[a.length]=dumpPuzzle(1);a[a.length]=dumpPuzzle(0);return a}
function movesEasy(){return autosolveStepsByMove[0]+autosolveStepsByMove[1]+autosolveStepsByMove[2]+autosolveStepsByMove[3]+autosolveStepsByMove[4]}function movesHard(){return autosolveStepsByMove[5]+autosolveStepsByMove[6]+autosolveStepsByMove[7]}
function infoAll(a,b){doRender=false;D_MIN_MOVES=[1E6,1E6,1E6];D_MAX_MOVES=[-1,-1,-1];D_MIN_SUM=[1E6,1E6,1E6];D_MAX_SUM=[-1,-1,-1];for(var e=0;e<puzzles[a].length;e++){currentBoard=e;currentDifficulty=0;newGame(puzzles[a][e]);reset();SYMMETRY_TYPE=symmetryType(solution);solve();var f=difficulty(),h=f==0?movesEasy():movesHard(),g=autosolveStepsSum;if(h<D_MIN_MOVES[f])D_MIN_MOVES[f]=h;if(h>D_MAX_MOVES[f])D_MAX_MOVES[f]=h;if(g<D_MIN_SUM[f])D_MIN_SUM[f]=g;if(g>D_MAX_SUM[f])D_MAX_SUM[f]=g}f=[];h=[];for(e=
0;e<puzzles[a].length;e++){currentBoard=e;currentDifficulty=0;newGame(puzzles[a][e]);g=infoRow();f[f.length]=g}if(b>0){g=[];var i;for(e=0;e<f.length;e++){i=f[e][2]+"-"+(b==1?f[e][18]:f[e][17]);if(g[i]){if(f[e][3]>g[i][3])g[i]=f[e]}else g[i]=f[e]}for(i in g)h[h.length]=g[i];f=h}header="puz#\t#unsolved\tsymmetryType\tdifficulty\tdifficultyLevel\t#steps\tstepsSum\tmove0\tmove1\tmove2\tmove3\tmove4\tmove5\tmove6\tmove7\teasymoves\thardmoves\tnumArrows\tarrows\tstones\tpuzzle";i=header+"\n";for(e=0;e<
f.length;e++)i+=e+"\t"+infoRowText(f[e])+"\n";return i}function difficulty(){var a,b,e;a=autosolveStepsByMove[5];b=autosolveStepsByMove[6];e=autosolveStepsByMove[7];if(a+b+e==0)return 0;if(e==0){if(a>1)return 2;if(a+b<=3)return 1}return 2}function difficultyName(a){if(a==0)return"Easy";if(a==1)return"Medium";if(a==2)return"Hard";return"WTF"}function difficultyName2(){if(currentBoard<60)return"Easy";if(currentBoard<90)return"Medium";return"Hard"}
function difficultyLevel(){var a=difficulty(),b=autosolveStepsByMove[5]+autosolveStepsByMove[6]+3*autosolveStepsByMove[7];b=a==0?autosolveSteps:b;return a/3+((b<D_MIN_MOVES[a]?0:b>D_MAX_MOVES[a]?1:(b-D_MIN_MOVES[a])/(D_MAX_MOVES[a]-D_MIN_MOVES[a]))+(autosolveStepsSum<D_MIN_SUM[a]?0:autosolveStepsSum>D_MAX_SUM[a]?1:1-(autosolveStepsSum-D_MIN_SUM[a])/(D_MAX_SUM[a]-D_MIN_SUM[a])))/6}
function translate(a,b,e,f){if(a<4)return translateBase(a,b,e,f);if(a==4){a=translateBase(1,b,e,f);return translateBase(2,a[0],a[1],a[2])}if(a==5){a=translateBase(1,b,e,f);return translateBase(0,a[0],a[1],a[2])}if(a==6){a=translateBase(1,b,e,f);return translateBase(3,a[0],a[1],a[2])}}
function translateBase(a,b,e,f){var h=PUZZLE_HEIGHT-1,g=PUZZLE_WIDTH-1;if(a==0){a=b==1?3:b==4?6:b==7?9:b==3?1:b==6?4:b==9?7:b;return[a,e,g-f]}if(a==1){a=b==1?7:b==2?8:b==3?9:b==7?1:b==8?2:b==9?3:b;return[a,h-e,f]}if(a==2){a=b==2?4:b==3?7:b==4?2:b==6?8:b==7?3:b==8?6:b;return[a,g-f,h-e]}if(a==3){a=b==1?9:b==2?6:b==4?8:b==6?2:b==8?4:b==9?1:b;return[a,f,e]}return null}
function dupe(a,b,e,f,h){for(var g=1E6,i,j,l,k,m=0,q,p=0;p<f.length;p++)for(var o=0;o<f[p].length;o++)if(!(p==b&&o==e)){solution=k=f[p][o];for(var n=-1;n<7;n++){for(var s=m=0;s<a.length;s++)for(var t=0;t<a[0].length;t++)if(n==-1)m+=differ(a[s][t],k[s][t]);else{q=translate(n,a[s][t],s,t);m+=differ(a[s][t],k[q[1]][q[2]])}if(m<g){g=m;i=p;j=o;l=k}}}solution=l;if(h)return g;return"closest match to "+b+","+e+": diff "+g+",  type "+n+", I "+i+", J "+j+", puz "+dumpPuzzle(0)}
function dupeAll(a){for(var b="",e=0;e<puzzles[a].length;e++)b+=dupe(puzzles[a][e],0,e,[puzzles[a]],false)+"\n";return b}function differ(a,b){if(a==b)return 0;return 1}function unsolved(){var a,b,e=0;badMarbles=emptySquares=totalMarbles=0;for(var f=1;f<board.length;f++)for(var h=1;h<board[0].length;h++){a=board[f][h];b=solution[f-1][h-1];if(a==5)totalMarbles++;else a==0&&emptySquares++;if(a==5&&b!=5){e++;badMarbles++}else b==5&&a!=5&&e++}return e};
