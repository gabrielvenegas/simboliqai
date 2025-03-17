import { RefObject, useEffect } from "react";

type LogoViewerProps = {
  svg?: {
    icon: string;
    text: string;
    font: string;
  };
  svgContainer: RefObject<HTMLDivElement | null>;
};

const icon = {
  icon: '<g id="icon"><path transform="translate(0,0)" fill="rgb(120,189,237)" d="M 233.094 1154.94 L 316.134 1154.96 C 336.409 1154.94 372.105 1148.24 377.985 1175.71 C 381.172 1190.6 371.337 1201.33 357.256 1204.19 C 338.229 1205 238.94 1206.07 226.078 1201.22 C 206.22 1193.73 208.35 1164.95 233.094 1154.94 z"/><path transform="translate(0,0)" fill="rgb(120,189,237)" d="M 233.094 1008.89 C 261.445 1008.51 289.83 1008.88 318.187 1008.86 C 338.157 1008.85 392.885 1000.85 401.507 1025.23 C 407.523 1042.24 399.027 1053.47 383.422 1059.09 C 345.365 1061.32 278.026 1061.59 239.787 1059.09 C 207.871 1057 205.204 1018.03 233.094 1008.89 z"/><path transform="translate(0,0)" fill="rgb(161,164,233)" d="M 1501.04 368.894 C 1727.98 351.298 1797.79 628.572 1731.86 644.244 C 1700.56 644.355 1706.16 618.727 1705.99 596.079 C 1705.28 504.886 1630.85 425.126 1539.54 417.828 C 1527.28 416.848 1500.14 419.258 1490.34 415.177 C 1471.52 407.336 1471.62 377.866 1501.04 368.894 z"/><path transform="translate(0,0)" fill="rgb(120,189,237)" d="M 512.713 368.894 L 1136.65 368.941 C 1155.65 368.944 1217.03 362.908 1231.43 375.174 C 1249.51 390.573 1238.04 416.909 1216.1 418.584 C 1192.88 420.356 1168.28 418.707 1144.92 418.682 L 546.5 418.665 C 491.752 418.346 448.168 425.753 405.572 462.599 C 336.012 522.768 344.874 598.751 344.927 681.127 L 344.941 828.39 C 345.017 845.738 351.138 924.472 306.874 895.216 C 291.875 885.303 296.06 865.295 296.057 850.04 L 295.989 646.158 C 295.983 615.385 293.265 581.86 299.499 551.697 C 321.999 442.84 408.143 381.976 512.713 368.894 z"/><path transform="translate(0,0)" fill="rgb(110,151,235)" d="M 1724.39 949.223 C 1749.25 948.022 1753.3 966.696 1753.34 987.346 L 1753.32 1413.74 C 1753.34 1439.85 1754.9 1466.71 1749.43 1492.4 C 1730.05 1583.38 1657.37 1658.32 1564.79 1674.51 C 1529.39 1680.7 1485.73 1677.7 1449.49 1677.66 L 537.322 1677.78 C 466.067 1677.86 413.062 1657.28 362.806 1606.71 C 295.49 1538.98 295.873 1471.62 296.05 1384.75 C 295.966 1365.47 286.15 1288.31 330.07 1305.32 C 349.464 1312.83 345.022 1348.42 344.993 1364.31 L 344.866 1429.29 C 344.823 1513.71 378.453 1582.69 461.818 1616.58 C 498.085 1631.32 527.372 1629.63 565.611 1629.64 L 1469.55 1629.64 C 1513.08 1629.65 1553.63 1632.54 1594.71 1614.85 C 1687.87 1574.75 1704.23 1499.28 1704.19 1410.66 L 1704.16 1054.53 C 1704.19 1024.19 1692.06 961.753 1723.05 949.732 L 1724.39 949.223 z"/><path transform="translate(0,0)" fill="rgb(120,189,237)" d="M 339.463 1418.3 L 341.686 1420.21 C 343.179 1424.83 342.602 1429.92 342.49 1434.73 C 339.162 1431.04 339.489 1423.11 339.463 1418.3 z"/><path transform="translate(0,0)" fill="rgb(110,151,235)" d="M 1012.99 492.853 C 1176.83 483.809 1350.23 580.661 1447.36 710.507 C 1579.64 887.337 1582.36 1144.72 1456.58 1326.07 C 1359.35 1466.26 1197.62 1551.42 1026.95 1555.08 C 729 1556.27 489.44 1326.49 486.998 1026.72 C 484.613 733.94 722.401 494.852 1012.99 492.853 z M 987.379 541.86 C 832.504 555.857 704.884 622.37 616.548 755.649 C 493.76 940.907 513.391 1186.59 663.217 1350.13 C 768.001 1464.51 899.536 1509.09 1050.25 1504.97 C 1078.52 1500.93 1106.36 1498.87 1134.25 1492.15 C 1521.57 1398.83 1636.95 886.649 1307.99 640.148 C 1214.31 569.947 1103.74 538.337 987.379 541.86 z"/><path transform="translate(0,0)" fill="rgb(161,164,233)" d="M 1137.4 639.079 C 1157.21 638.427 1196.42 657.355 1214.52 667.045 C 1385.16 758.422 1459.26 944.482 1417.38 1129.09 C 1411.48 1155.1 1398.11 1218.5 1368.26 1226.87 C 1350.64 1228.05 1342.48 1217.61 1338.52 1201.34 C 1341.99 1186.14 1350.05 1171.44 1356.09 1157.06 C 1427.65 986.611 1341.64 771.365 1169.98 701.121 C 1150.38 693.104 1110.66 686.588 1119.99 656.072 C 1122.65 647.354 1129.92 643.151 1137.4 639.079 z"/><path transform="translate(0,0)" fill="rgb(110,151,235)" d="M 996.764 741.208 C 1031.79 737.629 1027.23 770.667 1026.95 795.569 C 1147.29 801.831 1130.27 867.5 1098.05 863.266 C 1087.46 861.875 1076.85 854.538 1067.2 850.143 C 1005.71 822.146 886.042 840.909 904.816 922.625 C 924.669 1009.04 1128.13 1011.77 1154.43 1122.65 C 1174.23 1206.07 1099.13 1246.4 1029.99 1262.26 C 1029.62 1290.51 1039.12 1330.07 996.764 1327.92 C 993.522 1326.1 990.466 1323.95 987.379 1321.88 C 976.976 1310.17 980.827 1277.55 980.948 1262.26 C 957.017 1261.02 844.272 1246.12 863.807 1203.95 C 867.684 1195.58 875.325 1191.79 883.492 1188.72 C 896.13 1191.56 907.095 1198.12 918.989 1202.96 C 974.611 1225.57 1114.48 1228.38 1104.3 1142.44 C 1093.11 1047.93 863.563 1046.17 850.146 924.842 C 841.382 845.584 910.85 802.785 980.948 795.569 C 981.412 773.513 971.012 751.484 996.764 741.208 z"/></g>',
  text: '<text style="font-family: "Archivo", sans-serif; fill: black;">subtracker</text>',
  font: "",
};

export default function LogoViewer({
  // svg: icon,
  svgContainer,
}: LogoViewerProps) {
  useEffect(() => {
    const container = svgContainer.current;
    if (!container) return;

    // Build SVG wrapper with a proper viewBox to avoid cropping
    const svgContent = `
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="400"
          height="100"
          viewBox="0 0 400 100"
          preserveAspectRatio="xMinYMid meet"
        >
        ${icon.font}
        <g id="inner-container">
          ${icon.icon}
          ${icon.text}
        </svg>
      `;

    container.innerHTML = svgContent;

    const svg = container.querySelector("svg");
    if (!svg) return;

    const iconGroup = svg.querySelector("#icon") as SVGSVGElement;
    const textElem = svg.querySelector("text");
    const innerContainer = svg.querySelector(
      "#inner-container",
    ) as SVGSVGElement;

    if (!iconGroup || !textElem || !innerContainer) return;

    const iconBox = iconGroup.getBBox();
    const innerBox = innerContainer.getBBox();
    const textBox = textElem.getBBox();

    const desiredIconHeight = 70;
    const scaleFactor = desiredIconHeight / innerBox.height;

    iconGroup.setAttribute("transform", `scale(${scaleFactor})`);

    // this is important for text x threshold
    const iconWidthScaled = iconBox.width * scaleFactor;
    const iconHeightScaled = iconBox.height * scaleFactor;

    // calculate text x position
    const gap = 18;
    const textX = iconWidthScaled + gap;

    // calculate text font size
    const fontSize = desiredIconHeight - 28 - textBox.width * scaleFactor;

    const iconCenterY = iconBox.y * scaleFactor + iconHeightScaled / 2;
    textElem.setAttribute("x", String(textX));
    textElem.setAttribute("y", String(iconCenterY));
    textElem.style.fontSize = `${fontSize}px`;
    textElem.style.dominantBaseline = "central";

    const outerWidth = 382;
    const { x, width } = innerContainer.getBBox();

    const offsetX = outerWidth / 2 - (x + width / 2);

    innerContainer.setAttribute("transform", `translate(${offsetX}, 0)`);
  }, [icon]);

  return (
    <div>
      <div ref={svgContainer}></div>
      {/* <button onClick={downloadSvg}>Download SVG</button> */}
    </div>
  );
}
