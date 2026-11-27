import Foundation
import Vision
import ImageIO

var result = [String: [String: [[Double]]]]()
for path in CommandLine.arguments.dropFirst() {
    let url = URL(fileURLWithPath:path)
    guard let source = CGImageSourceCreateWithURL(url as CFURL, nil),
          let image = CGImageSourceCreateImageAtIndex(source, 0, nil) else { continue }
    let request = VNDetectFaceLandmarksRequest()
    try VNImageRequestHandler(cgImage:image).perform([request])
    guard let face = request.results?.max(by: { $0.boundingBox.width < $1.boundingBox.width }), let l = face.landmarks else { continue }
    var regions = [String:[[Double]]]()
    for (key,r) in [("mouth",l.outerLips),("left",l.leftEye),("right",l.rightEye)] {
        if let region = r {
            regions[key] = region.pointsInImage(imageSize: CGSize(width:image.width,height:image.height)).map { [Double($0.x)/Double(image.width), 1-Double($0.y)/Double(image.height)] }
        }
    }
    result[path] = regions
}
FileHandle.standardOutput.write(try JSONSerialization.data(withJSONObject:result))
